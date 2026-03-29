import { motion, useInView } from "framer-motion";
import {
  Smartphone,
  Database,
  Globe,
  Shield,
  CheckCircle,
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
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const steps: StepProps[] = [
    {
      title: "Create your space",
      description: "Sign in and land in one dashboard",
      icon: <Smartphone size={28} strokeWidth={1.75} />,
      details: [
        "Account is free to start",
        "Same layout on phone and desktop",
        "Optional import later",
        "No separate “workspace” apps",
      ],
    },
    {
      title: "Add what matters",
      description: "Places, notes, people, journal—where you need them",
      icon: <Database size={28} strokeWidth={1.75} />,
      details: [
        "Add entries in any order",
        "Tags and search across types",
        "Photos and text together",
        "Everything stays in your library",
      ],
    },
    {
      title: "Use it anywhere",
      description: "Designed for spotty connections",
      icon: <Globe size={28} strokeWidth={1.75} />,
      details: [
        "Read and edit offline",
        "Sync when the network returns",
        "Browser-based PWA-style flow",
        "No mandatory always-online mode",
      ],
    },
    {
      title: "Keep control",
      description: "Your device is the source of truth",
      icon: <Shield size={28} strokeWidth={1.75} />,
      details: [
        "Data stored locally first",
        "Export when you want",
        "No ads in the product UI",
        "You choose what to back up",
      ],
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
      className="relative px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-default overflow-hidden border-b border-default"
      aria-labelledby="how-it-works-title"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2
            id="how-it-works-title"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-primary mb-5"
          >
            How it{" "}
            <span className="text-primary-600 dark:text-primary-400">works</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Four straight steps from empty account to regular use. No gamified
            onboarding—just structure that matches the app itself.
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
                <div className="hidden lg:block absolute top-16 left-[58%] w-[82%] h-px bg-default border-t border-dashed border-default" />
              )}

              <div className="absolute z-10 -top-3 -left-3 w-9 h-9 rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center text-sm border-2 border-default">
                {index + 1}
              </div>

              <div
                className={`
                relative h-full bg-card rounded-2xl p-7 sm:p-8
                border border-default
                transition-all duration-300
                ${activeStep === index ? "shadow-medium ring-1 ring-primary-500/20" : ""}
              `}
              >
                <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-primary-500/10 border border-default text-primary-600">
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {step.title}
                </h3>
                <p className="text-muted mb-4 text-[15px] leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0.85, x: 0 }}
                      animate={{
                        opacity: activeStep === index ? 1 : 0.85,
                        x: activeStep === index ? 3 : 0,
                      }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 text-sm text-muted"
                    >
                      <CheckCircle
                        size={14}
                        className="text-primary-600 shrink-0 mt-0.5"
                      />
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
          <div className="relative rounded-2xl border border-default bg-card p-10 md:p-12 text-primary overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-default border border-default text-muted text-xs font-medium mb-8">
                <WifiOff size={14} className="text-primary-600" />
                <span>Offline-capable by design</span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-4 text-primary">
                Works without a connection,{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  syncs when you are back online
                </span>
              </h3>

              <p className="text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
                Local storage comes first. You can add and edit with no network;
                synchronization runs when connectivity is available again.
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
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-default border border-default mb-4">
                      <feature.icon
                        size={22}
                        className="text-primary-600"
                      />
                    </div>
                    <h4 className="font-medium text-primary mb-1">
                      {feature.label}
                    </h4>
                    <p className="text-sm text-muted">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Dexie.js mention */}
              <div className="mt-12 pt-8 border-t border-default">
                <p className="text-sm text-muted">
                  IndexedDB via Dexie—data remains on your device unless you
                  export or sync explicitly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
