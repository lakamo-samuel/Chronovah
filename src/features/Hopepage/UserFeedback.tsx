import { motion, useAnimationControls, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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

/**
 * Render the feedback section with responsive carousel behavior.
 *
 * Renders a desktop carousel that auto-scrolls when the section is in view and not hovered, and a mobile carousel with manual navigation controls (previous/next buttons and dot indicators). Each testimonial is rendered as a FeedbackCard.
 *
 * @returns The JSX element for the testimonials/feedback section.
 */
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
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-default overflow-hidden border-b border-default"
      aria-labelledby="feedback-title"
    >

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-default text-muted text-xs font-medium mb-5">
            <span className="text-primary-600">Feedback</span>
          </div>

          <h2
            id="feedback-title"
            className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-3"
          >
            What people{" "}
            <span className="text-primary-600 dark:text-primary-400">
              say about using it
            </span>
          </h2>

          <p className="text-sm text-muted max-w-lg mx-auto">
            Early users and testers—quoted as they wrote them, not marketing
            scores.
          </p>
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
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {feedbacks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "w-6 bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Render a testimonial card showing rating, quoted text, and user information.
 *
 * Displays the rating as stars, the testimonial text in quotation marks, and the user area
 * which shows either the user's avatar (if provided) or a fallback initial, plus the user's
 * name. Optionally renders the user's role and the testimonial date when present.
 *
 * @param feedback - The testimonial data used to populate the card
 * @returns The rendered feedback card element
 */
function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", damping: 20 }}
      className="min-w-[320px] max-w-[320px] bg-card rounded-xl p-6 border border-default shadow-soft hover:shadow-medium transition-shadow duration-300"
    >
      <Quote size={20} className="text-primary-600/40 mb-4" strokeWidth={1.5} />

      <div className="flex gap-0.5 mb-4" aria-hidden>
        {[...Array(feedback.rating)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-amber-500/90 text-amber-600"
          />
        ))}
      </div>

      <p className="text-primary/90 mb-6 text-sm leading-relaxed">
        &ldquo;{feedback.text}&rdquo;
      </p>

      {/* User info */}
      <div className="flex items-center gap-3">
        {feedback.image ? (
          <img
            src={feedback.image}
            alt={feedback.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
            {feedback.name[0]}
          </div>
        )}
        <div>
          <p className="font-medium text-primary">{feedback.name}</p>
          {feedback.role && (
            <p className="text-xs text-muted">{feedback.role}</p>
          )}
        </div>
      </div>

      {feedback.date && (
        <p className="mt-4 text-xs text-muted">{feedback.date}</p>
      )}
    </motion.div>
  );
}
