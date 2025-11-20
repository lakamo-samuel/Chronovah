import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [error, setError] = useState("");

  const handleReset = () => {
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    if (password !== cpassword) return setError("Passwords do not match.");

    setError("");

    // Connect to backend API
    console.log("New password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#05060a] p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white dark:bg-[#07101a] rounded-2xl shadow-lg border border-gray-200 dark:border-[#0b1220] p-6"
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Create your new password.
        </p>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
            New Password
          </label>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-[#14202b] bg-gray-50 dark:bg-[#071620]">
            <input
              type={show ? "text" : "password"}
              className="bg-transparent w-full outline-none text-sm text-gray-800 dark:text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button onClick={() => setShow(!show)} type="button">
              {show ? (
                <EyeOff className="text-gray-500" />
              ) : (
                <Eye className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
            Confirm Password
          </label>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-[#14202b] bg-gray-50 dark:bg-[#071620]">
            <input
              type={show2 ? "text" : "password"}
              className="bg-transparent w-full outline-none text-sm text-gray-800 dark:text-gray-100"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <button onClick={() => setShow2(!show2)} type="button">
              {show2 ? (
                <EyeOff className="text-gray-500" />
              ) : (
                <Eye className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Reset Password
        </button>

        <Link
          to="/signin"
          className="flex items-center gap-1 mt-6 text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
