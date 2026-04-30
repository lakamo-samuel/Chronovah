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
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail("");
  };

  const benefits = [
    { icon: Zap,    text: "Lightning fast",  color: "text-accent-yellow" },
    { icon: Shield, text: "Privacy first",   color: "text-accent-green" },
    { icon: Users,  text: "10k+ users",      color: "text-accent-blue" },
    { icon: Clock,  text: "Offline-first",   color: "text-accent-purple" },
  ];

  const socialProof = [
    { number: "10K+", label: "Users",    icon: Users },
    { number: "4.9",  label: "Rating",   icon: Star },
    { number: "50K+", label: "Memories", icon: Sparkles },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-default border-b border-default"
      aria-label="Call to action"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl sm:rounded-3xl shadow-hard border border-default overflow-hidden"
        >
          <div className="flex flex-col md:grid md:grid-cols-2">
            {/* Left — main content */}
            <div className="p-6 sm:p-8 lg:p-12 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="hidden xs:inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary-500/20"
              >
                <Sparkles size={14} className="text-primary-500" />
                <span>Ready to get organized?</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-primary"
              >
                Start your organized life
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg text-muted mb-6 sm:mb-8 leading-relaxed"
              >
                <span className="hidden sm:inline">
                  Join thousands of users who've already simplified their digital life.
                </span>
                <span className="sm:hidden">
                  Track notes, people, places and journal in one secure app.
                </span>
              </motion.p>

              {/* Benefits grid */}
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
                      <span className="text-xs sm:text-sm text-muted">{benefit.text}</span>
                    </div>
                  );
                })}
              </motion.div>

              {/* CTA buttons */}
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
                    className="w-full xs:flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-default hover:bg-card text-primary text-sm sm:text-base font-medium rounded-xl transition-colors border border-default"
                  >
                    <span>Watch demo</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Email signup */}
                <form onSubmit={handleSubmit} className="flex flex-col xs:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 bg-default border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full xs:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-base font-medium rounded-xl transition-colors shadow-soft whitespace-nowrap"
                  >
                    {isSubmitted ? "Sent!" : "Notify me"}
                  </button>
                </form>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-default"
              >
                <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4">
                  Trusted by users worldwide
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-6">
                  {socialProof.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                        <Icon size={14} className="text-primary-500" />
                        <div>
                          <span className="font-semibold text-sm sm:text-base text-primary">{item.number}</span>
                          <span className="text-xs sm:text-sm text-muted ml-1">{item.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right — feature list */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="relative bg-default p-6 sm:p-8 lg:p-12 order-1 md:order-2 border-b md:border-b-0 md:border-l border-default"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
                Everything you get:
              </h3>

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
                    <CheckCircle size={14} className="text-accent-green flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* User count badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 1 }}
                className="mt-6 sm:mt-8 p-3 sm:p-4 bg-card rounded-xl border border-default"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 border-2 border-card"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted">
                      Join <span className="font-bold text-primary">10k+</span> users
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className="fill-accent-yellow text-accent-yellow" />
                      ))}
                      <span className="text-xs text-muted ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#terms"   className="hover:text-primary transition-colors">Terms</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#twitter" className="hover:text-primary transition-colors" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#github"  className="hover:text-primary transition-colors" aria-label="GitHub"><Github size={16} /></a>
            <a href="#email"   className="hover:text-primary transition-colors" aria-label="Email"><Mail size={16} /></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
