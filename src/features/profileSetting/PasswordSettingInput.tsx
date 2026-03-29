import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ChangeEvent } from "react";

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
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
    <div className="space-y-2">
      <label className="block text-sm font-ui-sm-bold text-primary">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 text-muted" size={18} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-10 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
        />
        {showToggle && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-2 h-8 w-8 inline-flex items-center justify-center text-muted hover:text-primary transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
export default PasswordInput;