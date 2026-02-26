import { motion, useInView } from "framer-motion";
import {
  Smartphone,
  Database,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Cloud,
  WifiOff,
  Download,
  Share2,
} from "lucide-react";
import { useRef, useState, type JSX } from "react";

interface StepProps {
  title: string;
  description: string;
  icon: JSX.Element;
  details: string[];
  color: string;
  gradient: string;
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const steps: StepProps[] = [
    {
      title: "Create Your Space",
      description: "Start your digital sanctuary in seconds",
      icon: <Smartphone size={32} />,
      details: [
        "Sign up free, no credit card",
        "Choose your workspace style",
        "Import existing data easily",
        "Works on all devices",
      ],
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Add Everything",
      description: "Your life, organized your way",
      icon: <Database size={32} />,
      details: [
        "Save places with photos",
        "Write notes & journal entries",
        "Connect with people",
        "Tag and categorize everything",
      ],
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Access Anywhere",
      description: "Online or offline, always there",
      icon: <Globe size={32} />,
      details: [
        "Works without internet",
        "Syncs when you're back online",
        "Mobile & desktop friendly",
        "Real-time updates",
      ],
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Stay Private",
      description: "Your data belongs to you",
      icon: <Shield size={32} />,
      details: [
        "End-to-end encryption",
        "No third-party tracking",
        "Export your data anytime",
        "You control what's shared",
      ],
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const offlineFeatures = [
    {
      icon: WifiOff,
      label: "Offline-first",
      description: "Full functionality without internet",
    },
    {
      icon: Cloud,
      label: "Auto-sync",
      description: "Seamless sync when online",
    },
    {
      icon: Download,
      label: "Export data",
      description: "Take your data anywhere",
    },
    {
      icon: Share2,
      label: "Share controls",
      description: "Granular sharing permissions",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const, // Use "spring" as const
      damping: 20,
      stiffness: 100,
    },
  },
};


  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-white dark:bg-gray-950 overflow-hidden"
      aria-labelledby="how-it-works-title"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dotted pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />

        {/* Gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800"
          >
            <Clock size={16} />
            <span>Simple, powerful, private</span>
          </motion.div>

          {/* Title */}
          <h2
            id="how-it-works-title"
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              How it
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              works
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Four simple steps to a more organized life. No complicated setup, no
            learning curve — just start adding what matters to you.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              onHoverStart={() => setActiveStep(index)}
              onHoverEnd={() => setActiveStep(null)}
              className="group relative"
            >
              {/* Step connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 to-transparent">
                  <motion.div
                    animate={{
                      x: activeStep === index ? ["0%", "100%"] : "0%",
                      opacity: activeStep === index ? [0, 1, 0] : 0,
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"
                  />
                </div>
              )}

              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center text-lg shadow-lg">
                {index + 1}
              </div>

              {/* Card */}
              <div
                className={`
                relative h-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8
                border border-gray-200 dark:border-gray-800
                transition-all duration-300
                ${activeStep === index ? "scale-105 shadow-2xl border-transparent" : "scale-100"}
              `}
              >
                {/* Gradient border on hover */}
                <div
                  className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-r ${step.gradient} p-[2px] -z-10
                  transition-opacity duration-300
                `}
                >
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-2xl" />
                </div>

                {/* Icon */}
                <div
                  className={`
                  w-16 h-16 rounded-2xl mb-6 flex items-center justify-center
                  bg-gradient-to-r ${step.gradient} bg-opacity-10
                  group-hover:scale-110 transition-transform duration-300
                `}
                >
                  <div className="text-white">{step.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {step.description}
                </p>

                {/* Details list */}
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0.7, x: 0 }}
                      animate={{
                        opacity: activeStep === index ? 1 : 0.7,
                        x: activeStep === index ? 5 : 0,
                      }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <CheckCircle size={14} className={step.color} />
                      <span>{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Offline-first showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          {/* Main feature card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-3xl p-12 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#ffffff22_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-8 border border-white/20">
                <WifiOff size={14} />
                <span>Offline-first architecture</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Works offline,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  syncs when online
                </span>
              </h3>

              {/* Description */}
              <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
                Your data is always available, even without internet. Edit,
                create, and organize — everything syncs automatically when
                you're back online.
              </p>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {offlineFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">{feature.label}</h4>
                    <p className="text-sm text-white/60">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Dexie.js mention */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-white/40">
                  Powered by Dexie.js • Your data stays on your device until
                  you're ready to sync
                </p>
              </div>
            </div>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center mt-20"
        >
          <a
            href="#get-started"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <span>Start your organized life today</span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • Free forever • Export anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
