import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ShieldCheck, WifiOff, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BULLETS = [
  { icon: Zap,         label: "Fast and lightweight" },
  { icon: WifiOff,     label: "Works offline" },
  { icon: ShieldCheck, label: "Private by default" },
];

export default function CTAComponent() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-default bg-default py-24 md:py-32"
      aria-label="Call to action"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--color-primary-500)/8,transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Get started
          </p>

          <h2 className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl md:text-[3.25rem]">
            Your second brain,
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              built for real life
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Notes, places, people, and journal — all offline-first, all in one
            workspace. Free to start, no card required.
          </p>

          {/* Bullets */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {BULLETS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted">
                <Icon size={14} className="text-primary-500" />
                {label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-medium transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Start for free
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center gap-2 rounded-xl border border-default px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-card"
            >
              View pricing
            </button>
          </div>

          <p className="mt-5 text-xs text-muted">
            Free plan available forever. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
