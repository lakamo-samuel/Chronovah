import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Align = "center" | "hero";

interface CTAButtonProps {
  /** `hero`: centered on small screens, left-aligned from md up */
  align?: Align;
}

/**
 * Renders a call-to-action button and a short descriptive paragraph with responsive alignment.
 *
 * The `align` prop controls layout: `"center"` (default) centers content on all breakpoints;
 * `"hero"` centers on small screens and left-aligns on medium and larger screens with tighter spacing.
 *
 * @param align - Layout variant for the CTA wrapper (`"center"` or `"hero"`). Defaults to `"center"`.
 * @returns A JSX element containing a primary "Get started" button (navigates to `/dashboard`) and a subtitle line.
 */
function CTAButton({ align = "center" }: CTAButtonProps) {
  const isHero = align === "hero";
  const wrap = isHero
    ? "flex flex-col items-center md:items-start gap-3"
    : "flex flex-col items-center gap-4 mb-12";

  return (
    <div className={wrap}>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex max-w-md items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-medium transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-default dark:hover:bg-primary-500"
        onClick={() => {
          window.location.href = "/dashboard";
        }}
      >
        <span>Get started</span>
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
      </motion.button>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className={`text-sm text-muted ${isHero ? "text-center md:text-left max-w-md" : ""}`}
      >
        Free to start. No payment required.
      </motion.p>
    </div>
  );
}

export default CTAButton;
