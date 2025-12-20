// Spinner.tsx
import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg"; // Spinner size
  overlay?: boolean; // Full screen overlay or inline
  color?: string; // Tailwind color, e.g., "blue-500"
  thickness?: number; // Border thickness
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  overlay = true,
  color = "blue-500",
  thickness = 2,
}) => {
  // Map size to Tailwind classes
  const sizeClasses: Record<string, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const spinnerClasses = `rounded-full  animate-spin border-${thickness} border-t-${color} border-b-${color} border-l-${color} dark:border-r-gray-800 border-r-gray-200`;

  if (overlay) {
    return (
      <div className="fixed inset-0 dark:bg-gray-900 flex justify-center items-center  z-50">
        <div className={`${sizeClasses[size]} ${spinnerClasses}`}></div>
      </div>
    );
  }

  return <div className={`${sizeClasses[size]} ${spinnerClasses}`}></div>;
};

export default Spinner;
