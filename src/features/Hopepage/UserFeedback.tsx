import { motion, useAnimationControls, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";

interface Feedback {
  id: number;
  name: string;
  text: string;
  image?: string;
  rating: number;
  role?: string;
  date?: string;
}

const feedbacks: Feedback[] = [
  {
    id: 1,
    name: "Blessing A.",
    text: "Chronovah helped me organize everything. Notes, places, memories — all in one secure place. The offline support is a game-changer for someone like me who travels often.",
    rating: 5,
    role: "Digital Nomad",
    date: "March 2024",
  },
  {
    id: 2,
    name: "Daniel T.",
    text: "The offline support is crazy good. My data is always with me, even without internet. I've tried many productivity apps, but Chronovah's offline-first approach is unmatched.",
    rating: 5,
    role: "Software Engineer",
    date: "February 2024",
  },
  {
    id: 3,
    name: "Mary J.",
    text: "The UI is clean and fast. I love how simple it is to save and search everything. No clutter, no confusion — just pure productivity. The dark mode is gorgeous too!",
    rating: 5,
    role: "Content Creator",
    date: "March 2024",
  },
  {
    id: 4,
    name: "John K.",
    text: "Best productivity tool I've used this year. Sync + privacy is top notch. Finally, an app that respects my data while giving me all the features I need.",
    rating: 5,
    role: "Freelancer",
    date: "January 2024",
  },
  {
    id: 5,
    name: "Sarah M.",
    text: "The journaling feature alone is worth it. Being able to track my mood and thoughts alongside my notes and places gives me a complete picture of my life.",
    rating: 5,
    role: "Therapist",
    date: "March 2024",
  },
  {
    id: 6,
    name: "Michael R.",
    text: "I've been using Chronovah for 6 months now. It's become my digital brain. Everything from client meetings to travel memories is perfectly organized.",
    rating: 5,
    role: "Consultant",
    date: "February 2024",
  },
];

export default function UserFeedback() {
  const controls = useAnimationControls();
  const [isPaused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const carouselRef = useRef<HTMLDivElement>(null);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (!isMobile && !isPaused && isInView) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, isMobile, isInView, controls]);

  // Manual navigation for mobile
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden"
      aria-labelledby="feedback-title"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />

        {/* Quote marks pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-9xl font-serif text-gray-900 dark:text-white">
            "
          </div>
          <div className="absolute bottom-20 right-20 text-9xl font-serif text-gray-900 dark:text-white rotate-180">
            "
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4 border border-purple-200 dark:border-purple-800">
            <Star size={16} className="fill-purple-500" />
            <span>Loved by users worldwide</span>
          </div>

          {/* Title */}
          <h2
            id="feedback-title"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              What Our
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>

          {/* Rating summary */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                4.9
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on 2,000+ reviews
            </p>
          </div>
        </motion.div>

        {/* Desktop carousel */}
        {!isMobile ? (
          <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <motion.div
              ref={carouselRef}
              className="flex gap-6"
              animate={controls}
              style={{ width: "fit-content" }}
            >
              {[...feedbacks, ...feedbacks].map((item, index) => (
                <FeedbackCard key={`${item.id}-${index}`} feedback={item} />
              ))}
            </motion.div>
          </div>
        ) : (
          /* Mobile carousel with manual controls */
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: "spring", damping: 20 }}
              >
                {feedbacks.map((item) => (
                  <div key={item.id} className="min-w-full px-4">
                    <FeedbackCard feedback={item} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {feedbacks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "w-6 bg-purple-500"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          {[
            { label: "4.9/5 Rating", icon: Star },
            { label: "10k+ Downloads", icon: UserCircle },
            { label: "Privacy First", icon: Star },
          ].map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <Icon size={16} className="text-purple-500" />
                <span>{badge.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Feedback Card Component
function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", damping: 20 }}
      className="min-w-[320px] max-w-[320px] bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300"
    >
      {/* Quote icon */}
      <Quote size={24} className="text-purple-300 dark:text-purple-700 mb-4" />

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(feedback.rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
        ))}
      </div>

      {/* Feedback text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
        "{feedback.text}"
      </p>

      {/* User info */}
      <div className="flex items-center gap-3">
        {feedback.image ? (
          <img
            src={feedback.image}
            alt={feedback.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {feedback.name[0]}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {feedback.name}
          </p>
          {feedback.role && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {feedback.role}
            </p>
          )}
        </div>
      </div>

      {/* Date */}
      {feedback.date && (
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          {feedback.date}
        </p>
      )}
    </motion.div>
  );
}
