import type { ReactNode } from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  overlay?: boolean;
  className?: string;
  /** Accessible label when used without surrounding text */
  label?: ReactNode;
}

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-2",
  xl: "h-10 w-10 border-[3px]",
};

/**
 * App loading indicator. Uses static classes so Tailwind always includes the styles.
 * Accent ring uses the primary palette to match the rest of the UI.
 */
function Spinner({
  size = "md",
  overlay = true,
  className = "",
  label,
}: SpinnerProps) {
  const ring = `${sizeClasses[size]} rounded-full border-default border-t-primary-500 animate-spin`;

  const indicator = (
    <div
      className={`${ring} ${className}`}
      role="status"
      aria-busy="true"
      aria-label={typeof label === "string" ? label : "Loading"}
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-default/85 backdrop-blur-sm dark:bg-card-dark/90">
        <div className="flex flex-col items-center gap-3">
          {indicator}
          {label ? (
            <span className="text-sm text-muted">{label}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return label ? (
    <div className="inline-flex items-center gap-2">
      {indicator}
      <span className="text-sm text-muted">{label}</span>
    </div>
  ) : (
    indicator
  );
}

export default Spinner;
