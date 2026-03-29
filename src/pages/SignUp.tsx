// pages/SignUp.tsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../hooks/useValidation";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../features/Authentication/Oauth";
import Spinner from "../ui/Spinner";
import { authService, type SignUpCredentials } from "../services/auth.service";

/**
 * Render the sign-up page with client-side validation, password-strength feedback, animated visuals, and account creation flow.
 *
 * The component manages form state for full name, email, password, and confirm password; validates inputs and requires a minimum password strength before allowing submission; displays inline validation errors and a password strength indicator; submits credentials via `authService.signUp`, shows a success overlay on successful sign-up, calls `refresh()` from auth context, and navigates to `/otpverification` after a brief delay. UI elements include social sign-in button, animated background shapes, and accessible form controls with show/hide password toggles.
 *
 * @returns The SignUp page React element.
 */
export default function SignUp() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
    color: string;
  }>({ score: 0, message: "", color: "" });

  const nameError = touched.name ? validateName(name) : "";
  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const confirmPasswordError =
    touched.confirmPassword && password !== confirmPassword
      ? "Passwords do not match"
      : "";

  const isFormValid =
    !nameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    name &&
    email &&
    password &&
    confirmPassword &&
    passwordStrength.score >= 2;

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { message: "Very weak", color: "bg-red-500" },
      1: { message: "Weak", color: "bg-orange-500" },
      2: { message: "Fair", color: "bg-yellow-500" },
      3: { message: "Good", color: "bg-blue-500" },
      4: { message: "Strong", color: "bg-green-500" },
    };

    setPasswordStrength({
      score,
      message: strengthMap[score as keyof typeof strengthMap].message,
      color: strengthMap[score as keyof typeof strengthMap].color,
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    setFormError(null);

    try {
      setIsLoading(true);

      const credentials: SignUpCredentials = {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      };

      await authService.signUp(credentials);

      setIsSuccess(true);
      await refresh();

      // Small delay for success animation
      setTimeout(() => {
        navigate("/otpverification");
      }, 500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setFormError(
        err.message || "Failed to create account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            Create Account
          </h1>
          <p className="text-sm text-muted mt-2">
            Start your private life panel
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 sm:p-8"
        >
          {/* Social Login */}
          <div className="space-y-3">
            <GoogleAuthButton
              onClick={() => {
                /* Implement Google Sign-Up */
              }}
              label="Continue with Google"
              loading={loading}
            />
          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-muted">
                  or sign up with email
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-default border rounded-xl focus:outline-none focus:ring-2 transition-all text-primary ${
                    nameError && touched.name
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-default focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  aria-invalid={!!nameError}
                  aria-describedby="name-error"
                  disabled={loading}
                />
              </div>
              <AnimatePresence>
                {nameError && touched.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {nameError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

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
                  disabled={loading}
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
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 bg-default border rounded-xl focus:outline-none focus:ring-2 transition-all text-primary ${
                    passwordError && touched.password
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-default focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  aria-invalid={!!passwordError}
                  aria-describedby="password-error"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-default transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-muted" />
                  ) : (
                    <Eye size={16} className="text-muted" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-full rounded-full transition-colors ${
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : "bg-default"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${passwordStrength.color.replace("bg-", "text-")}`}
                  >
                    {passwordStrength.message}
                  </p>
                </div>
              )}

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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, confirmPassword: true }))
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-default border rounded-xl focus:outline-none focus:ring-2 transition-all text-primary ${
                    confirmPasswordError && touched.confirmPassword
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-default focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  aria-invalid={!!confirmPasswordError}
                  aria-describedby="confirm-password-error"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-default transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="text-muted" />
                  ) : (
                    <Eye size={16} className="text-muted" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {confirmPasswordError && touched.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {confirmPasswordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-default text-primary-500 focus:ring-primary-500/20 focus:ring-2"
                required
              />
              <label htmlFor="terms" className="text-xs text-muted">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-primary-500 hover:text-primary-600"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-primary-500 hover:text-primary-600"
                >
                  Privacy Policy
                </a>
              </label>
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
              disabled={loading || !isFormValid}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                loading || !isFormValid
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              } text-white shadow-lg hover:shadow-xl`}
            >
              {loading ? (
                <>
                  <Spinner
                    size="sm"
                    overlay={false}
                    className="border-white/30 border-t-white"
                  />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              Sign in
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
                  Account Created!
                </h3>
                <p className="text-sm text-muted">
                  Redirecting to verification...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
