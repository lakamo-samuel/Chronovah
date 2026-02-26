import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Users,
  NotebookPen,
  Book,
  Sparkles,
  ArrowRight,
  Globe,
  Lock,
  Zap,
  Heart,
  Star,
  Camera,
  Coffee,
} from "lucide-react";
import { useRef, useState, type JSX } from "react";
import Header from "../../components/Header";

interface Feature {
  title: string;
  description: string;
  longDescription: string;
  icon: JSX.Element;
  benefits: string[];
  stats?: string;
  color: string;
  darkColor: string;
  bgColor: string;
  darkBgColor: string;
  gradient: string;
}

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features: Feature[] = [
    {
      title: "Places",
      description: "Your personal travel diary & location journal",
      longDescription:
        "Save locations, memories, photos, and places you've been. Create collections, add notes, and relive your journeys.",
      icon: <MapPin size={28} />,
      benefits: ["Offline maps", "Photo albums", "Route tracking", "Favorites"],
      stats: "12k+ places saved",
      color: "text-blue-600",
      darkColor: "dark:text-blue-400",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-950/30",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Notes",
      description: "Your second brain for ideas & inspiration",
      longDescription:
        "Capture ideas, reminders, lists, and everything on your mind. Organize with tags, search instantly, never lose a thought.",
      icon: <NotebookPen size={28} />,
      benefits: ["Rich text", "Tags & categories", "Search", "Export"],
      stats: "50k+ notes created",
      color: "text-amber-600",
      darkColor: "dark:text-amber-400",
      bgColor: "bg-amber-50",
      darkBgColor: "dark:bg-amber-950/30",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "People",
      description: "Never forget a face or a birthday again",
      longDescription:
        "Store details about friends, family, clients, and relationships. Track important dates, preferences, and interactions.",
      icon: <Users size={28} />,
      benefits: [
        "Birthday reminders",
        "Relationship tags",
        "Interaction log",
        "Groups",
      ],
      stats: "8k+ connections",
      color: "text-emerald-600",
      darkColor: "dark:text-emerald-400",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-950/30",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Journal",
      description: "Understand yourself through daily reflection",
      longDescription:
        "Track your thoughts, mood, and daily emotional progress. Identify patterns, celebrate growth, and practice mindfulness.",
      icon: <Book size={28} />,
      benefits: [
        "Mood tracking",
        "Gratitude log",
        "Weekly summaries",
        "Private",
      ],
      stats: "15k+ entries",
      color: "text-purple-600",
      darkColor: "dark:text-purple-400",
      bgColor: "bg-purple-50",
      darkBgColor: "dark:bg-purple-950/30",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

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
      className="relative px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden"
      aria-labelledby="features-title"
    >
      <Header />
      {/* Animated background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl"
        />
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
            <Sparkles size={16} className="text-blue-500" />
            <span>Everything in one place</span>
          </motion.div>

          {/* Title */}
          <h2
            id="features-title"
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Your life,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              beautifully organized
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Chronovah brings together everything that matters — places you've
            been, people you love, thoughts you cherish, and moments you want to
            remember.
          </p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-10"
          >
            {[
              { icon: Globe, label: "Offline-first", color: "text-blue-500" },
              { icon: Lock, label: "Privacy focused", color: "text-green-500" },
              { icon: Zap, label: "Lightning fast", color: "text-yellow-500" },
              { icon: Heart, label: "Made with love", color: "text-red-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <stat.icon size={18} className={stat.color} />
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
                relative h-full bg-white dark:bg-gray-900 rounded-2xl p-8
                border border-gray-200 dark:border-gray-800
                transition-all duration-500 hover:shadow-2xl
                ${activeFeature === index ? "scale-105 shadow-xl" : "scale-100"}
              `}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5
                  bg-gradient-to-br ${feature.gradient} transition-opacity duration-500
                `}
                />

                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div
                    className={`
                    absolute inset-0 rounded-xl blur-md
                    bg-gradient-to-r ${feature.gradient} opacity-20
                    group-hover:opacity-30 transition-opacity duration-500
                  `}
                  />
                  <div
                    className={`
                    relative w-14 h-14 rounded-xl flex items-center justify-center
                    ${feature.bgColor} ${feature.darkBgColor}
                    group-hover:scale-110 transition-transform duration-300
                  `}
                  >
                    <div className={`${feature.color} ${feature.darkColor}`}>
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>

                {/* Benefits list */}
                <div className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div
                        className={`w-1 h-1 rounded-full bg-gradient-to-r ${feature.gradient}`}
                      />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Stats tag */}
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {feature.stats}
                </div>

                {/* Learn more link - appears on hover */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: activeFeature === index ? 1 : 0,
                    x: activeFeature === index ? 0 : -10,
                  }}
                  className="absolute bottom-8 right-8"
                >
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${feature.color}`}
                  >
                    <span>Learn more</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              </div>

              {/* Decorative corner gradient on hover */}
              <div
                className={`
                absolute -top-2 -right-2 w-20 h-20 
                bg-gradient-to-br ${feature.gradient} 
                rounded-full opacity-0 group-hover:opacity-20 blur-xl
                transition-opacity duration-500 -z-10
              `}
              />
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl p-12 border border-gray-200 dark:border-gray-800">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Ready to get organized?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of users who've already simplified their digital
                life. Start free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#get-started"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Get started free</span>
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <Camera size={18} />
                  <span>Watch demo</span>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span>4.9/5 from 2k+ reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coffee size={14} className="text-brown-500" />
                  <span>Loved by productivity enthusiasts</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
