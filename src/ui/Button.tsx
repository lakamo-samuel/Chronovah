import {  type ReactNode } from "react";

interface Prop{
  onClick: () => Promise<void>,
  loading: boolean,
  children: ReactNode
}

function Button({ onClick, loading, children }: Prop) {
  return (
    <button
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      onClick={onClick}
      disabled={loading}
      aria-live="polite"
    >
      {children}
    </button>
  );
}

export default Button;