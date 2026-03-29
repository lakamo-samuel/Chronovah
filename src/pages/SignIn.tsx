// pages/SignIn.tsx
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../hooks/useValidation";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../features/Authentication/Oauth";
import Spinner from "../ui/Spinner";
import { authService, type SignInCredentials } from "../services/auth.service";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { refresh } = useAuth();

  // Demo credentials for quick testing
  // const demoCredentials = {
  //   email: "demo@chronovah.com",
  //   password: "Demo123!",
  // };

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const isFormValid = !emailError && !passwordError && email && password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setFormError(null);

    try {
      setIsLoading(true);

      const credentials: SignInCredentials = {
        email: email.trim(),
        password,
      };

      const response = await authService.signIn(credentials);

      // Store token if provided
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }

      setIsSuccess(true);
       refresh();

      // Small delay for success animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setFormError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDemoLogin = () => {
  //   setEmail(demoCredentials.email);
  //   setPassword(demoCredentials.password);
  //   setRemember(true);
  //   // Auto-submit after setting demo credentials
  //   setTimeout(() => {
  //     if (isFormValid) {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       handleSubmit(new Event("submit") as any);
  //     }
  //   }, 100);
  // };

  // Floating shapes animation
  const floatingShapes = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 20,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-primary-500/5 dark:bg-primary-400/5 blur-xl"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Brand */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-muted mt-2">
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 sm:p-8"
        >
          {/* Demo Credentials Banner */}
          {/* <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Zap size={16} className="text-primary-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary mb-2">
                  Quick Demo Access
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  Use Demo Account
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div> */}

          {/* Social Login */}
          <div className="space-y-3">
            <GoogleAuthButton
              onClick={() => {
                /* Implement Google Sign-In */
              }}
              label="Continue with Google"
              loading={isLoading}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-muted">
                  or sign in with email
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-default border rounded-xl focus:outline-none focus:ring-2 transition-all text-primary ${
                    emailError && touched.email
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-default focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  aria-invalid={!!emailError}
                  aria-describedby="email-error"
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {emailError && touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-default border rounded-xl focus:outline-none focus:ring-2 transition-all text-primary ${
                    passwordError && touched.password
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-default focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  aria-invalid={!!passwordError}
                  aria-describedby="password-error"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-default transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-muted" />
                  ) : (
                    <Eye size={16} className="text-muted" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {passwordError && touched.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-default text-primary-500 focus:ring-primary-500/20 focus:ring-2"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <Link
                to="/forgot"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-xs text-red-500 text-center">
                    {formError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isLoading || !isFormValid
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <>
                  <Spinner
                    size="sm"
                    overlay={false}
                    className="border-white/30 border-t-white"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              Create one
            </Link>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
            <Shield size={12} />
            <span>Your data is encrypted and secure</span>
          </div>
        </motion.div>

        {/* Success Overlay */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary-500/10 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl text-center"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Welcome Back!
                </h3>
                <p className="text-sm text-muted">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
