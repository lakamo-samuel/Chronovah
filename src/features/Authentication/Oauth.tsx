import React from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../hooks/useDarkMode";


type GoogleAuthButtonProps = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  iconSize?: number;
};

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onClick,
  label = "Continue with Google",
  disabled,
  loading,
  className = "",

}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.96 }}
      aria-label={label}
      className={`w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl 
        border text-sm font-medium transition-all
        ${
          isDarkMode
            ? "bg-[#121826] text-gray-100 border-gray-700 hover:bg-[#1A2234]"
            : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
        }
        disabled:opacity-70 disabled:cursor-not-allowed 
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${className}
      `}
      style={{
        boxShadow: isDarkMode
          ? "inset 0 1px 0 rgba(255,255,255,0.05)"
          : "inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Loading Spinner */}
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
      ) : (
        // Google Logo
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 533.5 544.3"
          aria-hidden="true"
          focusable="false"
          role="img"
          shapeRendering="geometricPrecision"
          style={{ display: "inline-block" }}
        >
          <path
            d="M533.5 278.4c0-18.7-1.6-36.4-4.6-53H272v100h146.9c-6.3 34-25 62.8-53.3 82.2v68h85.9c50.4-46.5 79.3-114.8 79.3-197.2z"
            fill="#4285F4"
          />
          <path
            d="M272 544c70.9 0 130.3-23.5 173.7-63.7l-85.9-68c-23.9 16-54.5 25.6-87.8 25.6-67.5 0-124.6-45.5-145.1-106.6H42.5v66.8C85.9 468.6 168.2 544 272 544z"
            fill="#34A853"
          />
          <path
            d="M126.9 322.3c-10.6-31.8-10.6-66.4 0-98.2V157.8H42.5C14.4 207.1 0 256.9 0 309.5s14.4 102.4 42.5 151.7l84.4-139z"
            fill="#FBBC05"
          />
          <path
            d="M272 107.3c35.6 0 67.6 12.3 92.8 36.4l69-69C389.1 28.9 327.7 0 272 0 168.2 0 85.9 75.4 42.5 174.7l84.4 139c20.5-61.1 77.6-106.3 145.1-106.3z"
            fill="#EA4335"
          />
        </svg>
      )}

      {loading ? "Loading..." : label}
    </motion.button>
  );
};
