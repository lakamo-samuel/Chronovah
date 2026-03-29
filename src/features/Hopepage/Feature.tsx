import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Users,
  NotebookPen,
  Book,
  ArrowRight,
  Globe,
  Lock,
  Zap,
  Heart,
  Camera,
} from "lucide-react";
import { useRef, useState, type JSX } from "react";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  caption: string;
  /** Uses theme feature bg vars (swap automatically in .dark) */
  iconBg: string;
  /** Icon + link accent: light + dark variants from index.css */
  accent: string;
}

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features: Feature[] = [
    {
      title: "Places",
      description: "Trips, spots, and context you care about",
      icon: <MapPin size={26} strokeWidth={1.75} />,
      benefits: ["Per-place notes", "Tags", "Photos", "Works offline"],
      caption: "Travel & everyday places",
      iconBg: "bg-places-soft",
      accent: "places",
    },
    {
      title: "Notes",
      description: "Capture thought without switching apps",
      icon: <NotebookPen size={26} strokeWidth={1.75} />,
      benefits: ["Markdown", "Tags", "Search", "Pin & favorites"],
      caption: "Ideas and reference in one place",
      iconBg: "bg-notes-soft",
      accent: "notes",
    },
    {
      title: "People",
      description: "Contacts with context, not just names",
      icon: <Users size={26} strokeWidth={1.75} />,
      benefits: ["Roles & tags", "Important dates", "Notes", "Photos"],
      caption: "Relationships you actually use",
      iconBg: "bg-people-soft",
      accent: "people",
    },
    {
      title: "Journal",
      description: "Short entries that add up over time",
      icon: <Book size={26} strokeWidth={1.75} />,
      benefits: ["Mood", "Private by default", "Favorites", "Searchable"],
      caption: "Reflection without friction",
      iconBg: "bg-journal-soft",
      accent: "journal",
    },
  ];

  const accentClass: Record<
    Feature["accent"],
    { text: string; bullet: string }
  > = {
    places: {
      text: "text-[var(--color-places-light)] dark:text-[var(--color-places-dark)]",
      bullet:
        "bg-[var(--color-places-light)] dark:bg-[var(--color-places-dark)]",
    },
    notes: {
      text: "text-[var(--color-notes-light)] dark:text-[var(--color-notes-dark)]",
      bullet: "bg-[var(--color-notes-light)] dark:bg-[var(--color-notes-dark)]",
    },
    people: {
      text: "text-[var(--color-people-light)] dark:text-[var(--color-people-dark)]",
      bullet:
        "bg-[var(--color-people-light)] dark:bg-[var(--color-people-dark)]",
    },
    journal: {
      text: "text-[var(--color-journal-light)] dark:text-[var(--color-journal-dark)]",
      bullet:
        "bg-[var(--color-journal-light)] dark:bg-[var(--color-journal-dark)]",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
      id="features"
      ref={sectionRef}
      className="relative px-4 sm:px-6 lg:px-8 py-24 md:py-32 overflow-hidden border-b border-default bg-gradient-to-b from-primary-500/[0.08] via-default to-default dark:from-primary-400/[0.14] dark:via-[color-mix(in_oklab,var(--color-card)_65%,var(--color-bg))] dark:to-default"
      aria-labelledby="features-title"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40 dark:opacity-25" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center md:text-left"
        >
          <h2
            id="features-title"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-primary mb-5 md:max-w-4xl"
          >
            One workspace for{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
              places, notes, people, and journal
            </span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto md:mx-0 leading-relaxed">
            The same areas you use inside the app, presented clearly. Structured
            personal data you control—shown here in your current theme.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 mt-10"
          >
            {[
              { icon: Globe, label: "Offline-first" },
              { icon: Lock, label: "Local-first storage" },
              { icon: Zap, label: "Fast, lightweight UI" },
              { icon: Heart, label: "Built for daily use" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <stat.icon
                  size={16}
                  className="shrink-0 text-primary-600 dark:text-primary-400"
                />
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
              className="group relative h-full"
            >
              {/* Main card */}
              <div
                className={`
                relative h-full rounded-2xl p-7 sm:p-8
                border border-default bg-card
                shadow-soft transition-shadow duration-300 hover:shadow-medium
                dark:border-white/10
                ${activeFeature === index ? "ring-1 ring-primary-500/30 shadow-medium dark:ring-primary-400/35" : ""}
              `}
              >
                <div className="relative mb-6">
                  <div
                    className={`
                    relative flex h-12 w-12 items-center justify-center rounded-lg
                    ${feature.iconBg}
                    border border-default dark:border-white/10
                  `}
                  >
                    <div className={accentClass[feature.accent].text}>
                      {feature.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-1.5 text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted mb-3">{feature.caption}</p>
                <p className="text-[15px] mb-5 leading-relaxed text-primary">
                  {feature.description}
                </p>

                <div className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-muted"
                    >
                      <div
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentClass[feature.accent].bullet}`}
                      />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{
                    opacity: activeFeature === index ? 1 : 0,
                    x: activeFeature === index ? 0 : -6,
                  }}
                  className="absolute bottom-7 right-7 sm:bottom-8 sm:right-8"
                >
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${accentClass[feature.accent].text}`}
                  >
                    <span>Overview</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature preview section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="rounded-2xl border border-default bg-card p-10 md:p-12 shadow-soft dark:border-white/10">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-primary md:text-3xl">
                Ready to try it?
              </h3>
              <p className="mb-8 leading-relaxed text-muted">
                Create an account to use the same features described here. No
                credit card required to get started.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#get-started"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 font-medium text-white shadow-soft transition-colors hover:bg-primary-700 dark:hover:bg-primary-500"
                >
                  <span>Get started</span>
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-default bg-default px-7 py-3.5 font-medium text-primary transition-colors hover:bg-card dark:border-white/15 dark:bg-card/90 dark:hover:bg-card"
                >
                  <Camera size={18} strokeWidth={1.75} />
                  <span>See how it works</span>
                </a>
              </div>

              {/* Trust indicators */}
              {/* <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span>4.9/5 from 2k+ reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coffee size={14} className="text-brown-500" />
                  <span>Loved by productivity enthusiasts</span>
                </div>
              </div> */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
