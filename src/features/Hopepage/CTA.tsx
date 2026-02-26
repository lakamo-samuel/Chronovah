import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Users,
  Clock,
  Mail,
  Github,
  Twitter,
} from "lucide-react";
import CTAButton from "../../ui/CTAButton";

export default function CTAComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup
    console.log("Email submitted:", email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail("");
  };

  const benefits = [
    { icon: Zap, text: "Lightning fast", color: "text-yellow-500" },
    { icon: Shield, text: "Privacy first", color: "text-green-500" },
    { icon: Users, text: "10k+ users", color: "text-blue-500" },
    { icon: Clock, text: "Offline-first", color: "text-purple-500" },
  ];

  const socialProof = [
    { number: "10K+", label: "Users", icon: Users },
    { number: "4.9", label: "Rating", icon: Star },
    { number: "50K+", label: "Memories", icon: Sparkles },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
      aria-label="Call to action"
    >
      {/* Simplified background for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />

        {/* Lighter grid pattern for mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:24px_24px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {/* Stack on mobile, grid on desktop */}
          <div className="flex flex-col md:grid md:grid-cols-2">
            {/* Left side - Main content */}
            <div className="p-6 sm:p-8 lg:p-12 order-2 md:order-1">
              {/* Eyebrow - Hidden on smallest mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="hidden xs:inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-200 dark:border-blue-800"
              >
                <Sparkles size={14} className="text-blue-500" />
                <span>Ready to get organized?</span>
              </motion.div>

              {/* Mobile-friendly headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Start your
                </span>
                <br className="hidden xs:block" />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  organized life
                </span>
              </motion.h2>

              {/* Shorter description for mobile */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed"
              >
                <span className="hidden sm:inline">
                  Join thousands of users who've already simplified their
                  digital life.
                </span>
                <span className="sm:hidden">
                  Track notes, people, places & journeys in one secure app.
                </span>
              </motion.p>

              {/* Benefits - 2x2 grid on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8"
              >
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                      <Icon size={14} className={benefit.color} />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {benefit.text}
                      </span>
                    </div>
                  );
                })}
              </motion.div>

              {/* CTA Buttons - Stack on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col xs:flex-row gap-3">
                  <div className="w-full xs:flex-1">
                    <CTAButton />
                  </div>
                  <a
                    href="#demo"
                    className="w-full xs:flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base font-medium rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    <span>Watch demo</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Email signup - Simplified for mobile */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col xs:flex-row gap-2"
                >
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full xs:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    {isSubmitted ? "✓ Sent!" : "Notify me"}
                  </button>
                </form>
              </motion.div>

              {/* Trust indicators - Horizontal scroll on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-800"
              >
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  Trusted by users worldwide
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-6">
                  {socialProof.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 sm:gap-2"
                      >
                        <Icon size={14} className="text-blue-500" />
                        <div>
                          <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                            {item.number}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right side - Feature highlights (hidden on smallest mobile, visible on sm+) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 sm:p-8 lg:p-12 order-1 md:order-2"
            >
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Everything you get:
                </h3>

                {/* Compact feature list for mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    "Offline-first",
                    "End-to-end encryption",
                    "Unlimited notes",
                    "Cross-device sync",
                    "Dark mode",
                    "Export data",
                    "Free forever",
                    "Priority support",
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle
                        size={14}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* User count badge - Simplified */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 1 }}
                  className="mt-4 sm:mt-8 p-3 sm:p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-900"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Join{" "}
                        <span className="font-bold text-gray-900 dark:text-white">
                          10k+
                        </span>{" "}
                        users
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={10}
                            className="fill-yellow-500 text-yellow-500"
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">4.9</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom footer - Stack on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="#privacy"
              className="hover:text-gray-900 dark:hover:text-white transition"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="hover:text-gray-900 dark:hover:text-white transition"
            >
              Terms
            </a>
            <a
              href="#contact"
              className="hover:text-gray-900 dark:hover:text-white transition"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#twitter"
              className="hover:text-gray-900 dark:hover:text-white transition"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#github"
              className="hover:text-gray-900 dark:hover:text-white transition"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="#email"
              className="hover:text-gray-900 dark:hover:text-white transition"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
