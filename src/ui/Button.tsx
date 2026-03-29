import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => Promise<void> | void;
  loading?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  primary:
    'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-primary-300',
  secondary:
    'bg-default border border-default text-primary hover:bg-card disabled:opacity-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm font-ui-sm',
  md: 'px-4 py-2 text-sm font-ui-sm-bold',
  lg: 'px-6 py-3 text-base font-ui-base-bold',
};

/**
 * Renders a configurable button with support for loading state, icon, visual variants, sizes, and full-width mode.
 *
 * @param onClick - Optional click handler; may be synchronous or return a promise.
 * @param loading - When `true`, shows a spinning loader, disables the button, and sets `aria-busy`.
 * @param children - Button label or content.
 * @param variant - Visual variant to apply (`'primary' | 'secondary' | 'danger'`).
 * @param size - Size preset to apply (`'sm' | 'md' | 'lg'`).
 * @param fullWidth - When `true`, makes the button expand to the full container width.
 * @param icon - Optional icon node displayed when not in loading state.
 * @param className - Additional CSS class names appended to the computed classes.
 * @param disabled - When `true`, disables the button (also disabled while `loading`).
 * @param type - Native button type attribute (`'button' | 'submit' | 'reset'`).
 * @returns The rendered button element.
 */
function Button({
  onClick,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-lg transition-colors disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
      aria-live="polite"
      aria-busy={loading}
      type={type}
      {...props}
    >
      {loading ? <Loader size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

export default Button;