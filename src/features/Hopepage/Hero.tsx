import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import CTAButton from "../../ui/CTAButton";
import {
  Users,
  Activity,
  MapPin,
  NotebookPen,
  BookHeart,
} from "lucide-react";

const METRICS = {
  totalUsers: 1247,
  activeUsers: 342,
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

/** Fixed dot positions so layout is stable across renders */
const HERO_DOTS = [
  { left: 12, top: 18, size: 5, delay: 0, duration: 28 },
  { left: 78, top: 22, size: 4, delay: 2, duration: 32 },
  { left: 44, top: 8, size: 3, delay: 4, duration: 26 },
  { left: 88, top: 55, size: 6, delay: 1, duration: 30 },
  { left: 22, top: 62, size: 4, delay: 3, duration: 34 },
  { left: 65, top: 72, size: 3, delay: 5, duration: 29 },
  { left: 52, top: 38, size: 5, delay: 2, duration: 31 },
  { left: 8, top: 45, size: 3, delay: 6, duration: 27 },
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const floatingDots = useMemo(() => HERO_DOTS, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-default"
      aria-label="Hero"
    >
      {/* Theme-aware base + soft color (readable in light & dark) */}
      <div
        className="absolute inset-0 bg-default"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,var(--color-primary-200),transparent_55%)] opacity-90 dark:bg-[radial-gradient(ellipse_85%_55%_at_30%_0%,var(--color-primary-900),transparent_60%)] dark:opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_50%,var(--color-secondary-200)/35,transparent_55%)] dark:bg-[radial-gradient(ellipse_60%_45%_at_95%_40%,var(--color-secondary-800)/25,transparent_55%)]"
        aria-hidden
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingDots.map((dot) => (
          <div
            key={`${dot.left}-${dot.top}`}
            className="absolute rounded-full bg-primary-400/35 dark:bg-primary-400/20 animate-float-slow"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy: centered on mobile, left on md+ */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            className="lg:col-span-7 flex flex-col text-center md:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-primary-500/25 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-400/30 dark:bg-primary-500/15 dark:text-primary-200 md:self-start"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-40 dark:bg-primary-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400" />
              </span>
              Trusted by {formatNumber(METRICS.totalUsers)}+ people
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span className="block">Your life, organized</span>
              <span className="mt-2 block text-primary-600 dark:text-primary-400">
                in one calm workspace
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg md:mx-0 mx-auto"
            >
              Places, people, notes, and journal—structured the same way as
              inside Chronovah. Works offline; your theme and colors follow you.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <CTAButton align="hero" />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 w-full max-w-md md:max-w-lg"
            >
              <div className="flex flex-row items-stretch justify-between gap-4 rounded-2xl border border-default bg-card/90 p-4 shadow-medium backdrop-blur-sm sm:p-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                    <Users
                      className="h-4 w-4 text-primary-600 dark:text-primary-400 sm:h-5 sm:w-5"
                      strokeWidth={2}
                    />
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">
                      Total
                    </span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-primary sm:text-3xl md:text-4xl">
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatNumber(METRICS.totalUsers)}+
                    </span>
                  </div>
                </div>

                <div
                  className="w-px self-stretch bg-default"
                  aria-hidden
                />

                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                    <Activity
                      className="h-4 w-4 text-[var(--color-accent-green)] sm:h-5 sm:w-5"
                      strokeWidth={2}
                    />
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">
                      Active
                    </span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-primary sm:text-3xl md:text-4xl">
                    <span className="text-accent-green">
                      {formatNumber(METRICS.activeUsers)}+
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted md:justify-start">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                Community activity · illustrative figures
              </p>
            </motion.div>
          </motion.div>

          {/* Desktop accent panel: feature colors from app theme */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="relative hidden lg:col-span-5 lg:block"
          >
            <div className="relative overflow-hidden rounded-3xl border border-default bg-card p-8 shadow-hard">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-400/15" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-secondary-500/15 blur-3xl dark:bg-secondary-600/20" />
              <p className="relative text-sm font-medium text-primary">
                Everything in one place
              </p>
              <div className="relative mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-default bg-places-soft px-4 py-3">
                  <MapPin
                    className="h-5 w-5 shrink-0 text-[var(--color-places-light)]"
                    strokeWidth={2}
                  />
                  <span className="text-sm font-medium text-primary">
                    Places
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-default bg-notes-soft px-4 py-3">
                  <NotebookPen
                    className="h-5 w-5 shrink-0 text-[var(--color-notes-light)]"
                    strokeWidth={2}
                  />
                  <span className="text-sm font-medium text-primary">
                    Notes
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-default bg-people-soft px-4 py-3">
                  <Users
                    className="h-5 w-5 shrink-0 text-[var(--color-people-light)]"
                    strokeWidth={2}
                  />
                  <span className="text-sm font-medium text-primary">
                    People
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-default bg-journal-soft px-4 py-3">
                  <BookHeart
                    className="h-5 w-5 shrink-0 text-[var(--color-journal-light)]"
                    strokeWidth={2}
                  />
                  <span className="text-sm font-medium text-primary">
                    Journal
                  </span>
                </div>
              </div>
              <p className="relative mt-6 text-xs leading-relaxed text-muted">
                Same four pillars as your dashboard—colors respect light and
                dark mode.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 flex justify-center pb-8 lg:hidden"
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-default p-1">
            <div className="h-2 w-1.5 rounded-full bg-primary-500/70 dark:bg-primary-400/80 animate-bounce-slow" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
