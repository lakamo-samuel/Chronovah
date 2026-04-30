import { useState } from "react";
import { ChevronDown, HelpCircle, Search, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItem = {
  question: string;
  answer: string;
  category?: string;
};

const faqs: FaqItem[] = [
  {
    question: "What is Chronovah?",
    answer:
      "Chronovah is your digital life organizer — a private space to store memories, places, people, notes, and journal entries. Think of it as your second brain that works offline and syncs seamlessly across devices.",
    category: "general",
  },
  {
    question: "Is my data really secure?",
    answer:
      "Absolutely. Your data is encrypted locally before it ever leaves your device. We use industry-standard encryption (AES-256) and never have access to your personal information. You control what gets backed up and when.",
    category: "security",
  },
  {
    question: "How does offline mode work?",
    answer:
      "Chronovah is built with an offline-first architecture using Dexie.js (IndexedDB). This means your data lives on your device first. You can view, edit, and create content without an internet connection. When you're back online, everything syncs automatically in the background.",
    category: "technical",
  },
  {
    question: "Can I sync across multiple devices?",
    answer:
      "Yes! Your data syncs seamlessly across all your devices. Changes made on your phone appear on your laptop instantly when online. And thanks to our offline-first approach, you'll never lose work done without internet.",
    category: "technical",
  },
  {
    question: "Is Chronovah really free?",
    answer:
      "Yes! Chronovah offers a generous free plan that includes all core features. We also offer premium plans for users who need more storage, advanced sharing options, and priority support. No time limits, no hidden fees.",
    category: "pricing",
  },
  {
    question: "Can I export my data?",
    answer:
      "Always. Your data belongs to you. You can export everything as JSON, Markdown, or CSV files at any time. No lock-in, no restrictions.",
    category: "general",
  },
  {
    question: "What makes Chronovah different from other apps?",
    answer:
      "Unlike other apps that require constant internet, Chronovah works offline-first. You also get all four tools (Places, Notes, People, Journal) in one unified dashboard with a beautiful, distraction-free interface.",
    category: "general",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up for free, and you're ready to go! Start by adding your first place, note, person, or journal entry. No tutorials needed — the interface is intuitive and clean.",
    category: "general",
  },
];

const categories = [
  { id: "all",       label: "All Questions", icon: HelpCircle },
  { id: "general",   label: "General",       icon: MessageCircle },
  { id: "security",  label: "Security",      icon: HelpCircle },
  { id: "technical", label: "Technical",     icon: HelpCircle },
  { id: "pricing",   label: "Pricing",       icon: HelpCircle },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-default overflow-hidden border-b border-default">
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-4">
            Frequently asked{" "}
            <span className="text-primary-600 dark:text-primary-400">questions</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            Straight answers about Chronovah. If something is not covered, use the contact option below.
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-primary-500 text-white"
                      : "bg-card border border-default text-muted hover:text-primary hover:bg-default"
                  }`}
                >
                  <Icon size={15} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div
                  className={`rounded-xl border bg-card transition-all duration-300 hover:shadow-medium ${
                    openIndex === index
                      ? "border-primary-500/30 shadow-soft"
                      : "border-default"
                  }`}
                >
                  <button
                    className="w-full flex justify-between items-center p-5 sm:p-6 text-left"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-${index}-panel`}
                    onClick={() => toggle(index)}
                  >
                    <span className="font-semibold text-base sm:text-lg text-primary pr-6">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        openIndex === index
                          ? "bg-primary-500/10 text-primary-500"
                          : "bg-default text-muted group-hover:bg-primary-500/10 group-hover:text-primary-500"
                      }`}
                    >
                      <ChevronDown size={17} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          id={`faq-${index}-panel`}
                          className="px-5 sm:px-6 pb-5 sm:pb-6 text-muted leading-relaxed text-sm sm:text-base"
                        >
                          {item.answer}
                          {item.category && (
                            <div className="mt-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-default text-muted capitalize">
                                {item.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted">No questions found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="mt-4 text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center p-8 rounded-2xl border border-default bg-card"
        >
          <h3 className="font-serif text-xl font-bold mb-2 text-primary">
            Still have questions?
          </h3>
          <p className="text-muted mb-6 text-sm sm:text-base">
            Can't find the answer you're looking for? Reach out to our team.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-soft"
          >
            <MessageCircle size={18} />
            <span>Contact Support</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
