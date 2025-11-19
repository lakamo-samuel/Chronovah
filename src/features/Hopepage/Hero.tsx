import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CTAButton from "../../ui/CTAButton";
import { Box, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

interface DotProp {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

type Metrics = {
  totalUsers: number;
  activeUsers: number;
};

export default function Hero() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [floatingDots, setFloatingDots] = useState<DotProp[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    activeUsers: 0,
  });
  const [targets, setTargets] = useState<Metrics>({
    totalUsers: 1200,
    activeUsers: 320,
  });
  const [animState, setAnimState] = useState<{
    currentTotal: number;
    currentActive: number;
  }>({
    currentTotal: 0,
    currentActive: 0,
  });

  // Initialize dots
  useEffect(() => {
    const dots = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 10,
      duration: Math.random() * 50 + 50,
    }));
    setFloatingDots(dots);
  }, []);

  // Simple count-up animation helper
  const animateValue = (
    start: number,
    end: number,
    durationMs: number,
    onUpdate: (n: number) => void
  ) => {
    const startTime = performance.now();
    const animate = (t: number) => {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutQuad for nice feel
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.round(start + (end - start) * eased);
      onUpdate(value);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Update targets (could be from API)
  // Example: simulate occasional updates to reflect live data
  useEffect(() => {
    // Mock: every 15 seconds, bump targets a bit
    const interval = setInterval(() => {
      setTargets((t) => ({
        totalUsers: t.totalUsers + Math.floor(Math.random() * 20),
        activeUsers: Math.max(
          0,
          t.activeUsers + Math.floor(Math.random() * 10 - 2)
        ),
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // On targets change, animate to new values
  useEffect(() => {
    // animate totalUsers
    animateValue(metrics.totalUsers, targets.totalUsers, 700, (v) => {
      setMetrics((m) => ({ ...m, totalUsers: v }));
      setAnimState((a) => ({ ...a, currentTotal: v }));
    });
    // animate activeUsers
    animateValue(metrics.activeUsers, targets.activeUsers, 500, (v) => {
      setMetrics((m) => ({ ...m, activeUsers: v }));
      setAnimState((a) => ({ ...a, currentActive: v }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.totalUsers, targets.activeUsers]);

  // Seed initial render
  useEffect(() => {
    // start from 0 to initial targets
    setMetrics({ totalUsers: 0, activeUsers: 0 });
    setAnimState({ currentTotal: 0, currentActive: 0 });
    // small delay to allow DOM paint
    const t = setTimeout(() => {
      setTargets({ totalUsers: 1200, activeUsers: 320 });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen bg-linear-to-r from-blue-100 via-pink-50 to-yellow-50 relative overflow-hidden flex justify-center items-center text-center px-4 py-20">
      <div className="absolute -top-2 -left-5 w-36 h-4  rounded-2xl bg-blue-700"></div>

      <header className="fixed rounded-full top-3 w-full px-4 py-3 max-w-3xl flex justify-between items-center z-30 shadow-md backdrop-blur-lg bg-white/50 backdrop-saturate-150 bg-linear-to-r from-blue-100 via-pink-50 to-yellow-50">
        <div className="flex items-center gap-2">
          <Box className="w-8 h-8 rounded-xl bg-blue-500 text-gray-800 dark:text-gray-100 tracking-wide" />
          <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wide">
            Chronova
          </h1>
        </div>
        <div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 transition"
          >
            {isDarkMode ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {floatingDots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-blue-900 opacity-30 animate-float"
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

      <div className="hero-content relative z-20 flex flex-col items-center justify-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.12, delay: 0.2 }}
          className="text-3xl font-bold text-primary mb-3"
        >
          <span>Keep Track of your </span>
          <br />
          <span className="bg-gradient-to-r from-blue-700 via-pink-500 to-pink-300 bg-clip-text text-transparent">
            Life Details
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-lg text-gray-900 opacity-80 mb-5"
        >
          Organize your Places, People & Notes — all in one simple dashboard.
        </motion.p>

        <CTAButton />

        {/* Animated metrics row */}
        <div
          className="mt-6 w-full max-w-md mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-md backdrop-saturate-150 rounded-lg py-3 shadow-md"
          aria-live="polite"
          aria-label="Live metrics: total users and active users"
        >
          <div className="flex justify-between relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full ">
              <div>
                <span className="font-bold text-blue-700 text-[3rem] font-mono">
                  {animState.currentTotal.toLocaleString()}+
                </span>
                <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-blue-500"
                    aria-hidden="true"
                  >
                    <path d="M7 11l5-5 5 5v7a2 2 0 01-2 2H9a2 2 0 01-2-2v-7z" />
                  </svg>
                  <span className="text-lg"> users</span>
                </div>
              </div>
            </span>
            <div className="w-2 h-full rounded-2xl bg-blue-800 absolute"></div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full ">
              <div>
                <span className="font-bold text-blue-700 text-[3rem] font-mono">
                  {animState.currentActive.toLocaleString()}+d
                </span>
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-green-500"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15l-5-5 1.5-1.5L11 13l6.5-6.5L19 8l-8 9z" />
                  </svg>
                  <span className="text-lg">active today</span>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
