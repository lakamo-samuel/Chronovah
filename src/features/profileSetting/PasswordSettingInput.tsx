import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ChangeEvent } from "react";

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
  // strength is optional and only used for New Password field
  endAdornment?: React.ReactNode;
};

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  showToggle = true,
}: PasswordInputProps) {
  const [show, setShow] = useState<boolean>(false);
 
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium dark:text-gray-100">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-12 py-3 dark:bg-gray-800 dark:text-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {showToggle && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-2 h-8 w-8 inline-flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
export default PasswordInput;