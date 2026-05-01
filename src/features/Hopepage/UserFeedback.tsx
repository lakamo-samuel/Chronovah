import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Blessing A.",
    role: "Digital Nomad",
    text: "Chronovah helped me organize everything. Notes, places, memories — all in one secure place. The offline support is a game-changer for someone who travels often.",
    rating: 5,
  },
  {
    id: 2,
    name: "Daniel T.",
    role: "Software Engineer",
    text: "The offline-first architecture is genuinely impressive. My data is always with me. I have tried many productivity apps but nothing matches this approach.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mary J.",
    role: "Content Creator",
    text: "Clean, fast, and distraction-free. I love how simple it is to save and search everything. The dark mode is gorgeous too.",
    rating: 5,
  },
  {
    id: 4,
    name: "John K.",
    role: "Freelancer",
    text: "Best productivity tool I have used this year. Sync and privacy are top notch. Finally an app that respects my data while giving me all the features I need.",
    rating: 5,
  },
  {
    id: 5,
    name: "Sarah M.",
    role: "Therapist",
    text: "The journaling feature alone is worth it. Tracking mood and thoughts alongside notes and places gives me a complete picture of my life.",
    rating: 5,
  },
  {
    id: 6,
    name: "Michael R.",
    role: "Consultant",
    text: "Six months in and it has become my digital brain. Everything from client meetings to travel memories is perfectly organized.",
    rating: 5,
  },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-default bg-card p-7">
      <Quote size={18} className="mb-4 shrink-0 text-primary-500/40" strokeWidth={1.5} />
      <div className="mb-4 flex gap-0.5" aria-hidden>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
        ))}
      </div>
      <p className="mb-6 flex-1 text-[0.9375rem] leading-relaxed text-primary/90">
        {t.text}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          {t.name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{t.name}</p>
          <p className="text-sm text-muted">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function UserFeedback() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [page, setPage] = useState(0);

  const perPage = 3;
  const totalPages = Math.ceil(TESTIMONIALS.length / perPage);
  const visible = TESTIMONIALS.slice(page * perPage, page * perPage + perPage);

  return (
    <section
      ref={ref}
      className="relative border-b border-default bg-default py-24 md:py-32"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Testimonials
            </p>
            <h2
              id="testimonials-heading"
              className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl"
            >
              What people say
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Early users and testers — quoted as they wrote them.
            </p>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-default bg-card text-muted transition-colors hover:bg-default disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-muted tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-default bg-card text-muted transition-colors hover:bg-default disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((t) => (
            <Card key={t.id} t={t} />
          ))}
        </motion.div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === page ? "w-6 bg-primary-500" : "w-1.5 bg-default border border-default"
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
