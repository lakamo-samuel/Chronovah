// Reusable skeleton block — uses the .skeleton CSS class from index.css
// which reads from CSS variables so it respects all themes and dark mode.

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
