import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import CTAButton from "../../ui/CTAButton";
import { Box, Moon, Sun, Users, Activity } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { NavLink } from "react-router-dom";

// Types
interface DotProps {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

// Static metrics
const METRICS = {
  totalUsers: 1247,
  activeUsers: 342,
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Helper to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export default function Hero() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Floating dots
  const floatingDots: DotProps[] = [
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 8 + 3,
      delay: Math.random() * 10,
      duration: Math.random() * 20 + 30,
    })),
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      aria-label="Hero section"
    >
      {/* Animated background dots - contained within section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-blue-500/20 dark:bg-blue-400/30 animate-float-slow"
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

      {/* Gradient orb - contained */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] max-w-full bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50 px-4"
      >
        <nav className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-800/30">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Chronovah home"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Chronovah
            </span>
          </NavLink>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>

            <NavLink
              to="/dashboard"
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm sm:text-base font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign In
            </NavLink>
          </div>
        </nav>
      </motion.header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
          className="w-full text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-800"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Trusted by {formatNumber(METRICS.totalUsers)}+ users
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 px-4"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Keep Track of your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              Life Details
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto px-4"
          >
            Organize your Places, People, Notes & Journal — all in one simple
            dashboard. Access anywhere, even offline.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <CTAButton />
          </motion.div>

          {/* Metrics Card - Fixed horizontal layout */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 w-full max-w-lg mx-auto px-4"
          >
            <div className="flex flex-row items-center justify-between p-4 sm:p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-800/30 shadow-2xl">
              {/* Total Users - Left side */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    {formatNumber(METRICS.totalUsers)}+
                  </span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-12 mx-2 sm:mx-4 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-700" />

              {/* Active Users - Right side */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                    {formatNumber(METRICS.activeUsers)}+
                  </span>
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Real-time data • Updated live</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
          <span className="text-xs uppercase tracking-wider font-medium">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce-slow" />
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-5px, 15px); }
          75% { transform: translate(-15px, -5px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
