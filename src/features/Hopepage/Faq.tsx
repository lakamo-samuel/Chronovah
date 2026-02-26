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
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "general", label: "General", icon: MessageCircle },
  { id: "security", label: "Security", icon: HelpCircle },
  { id: "technical", label: "Technical", icon: HelpCircle },
  { id: "pricing", label: "Pricing", icon: HelpCircle },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800">
            <HelpCircle size={16} />
            <span>Got questions?</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about Chronovah. Can't find what you're
            looking for? Feel free to reach out to our support team.
          </p>
        </motion.div>

        {/* Search and filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Search bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      selectedCategory === cat.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQs list */}
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
                  className={`
                  rounded-xl border border-gray-200 dark:border-gray-800 
                  bg-white dark:bg-gray-900/50 backdrop-blur-sm
                  hover:shadow-lg transition-all duration-300
                  ${openIndex === index ? "shadow-lg border-blue-200 dark:border-blue-800" : ""}
                `}
                >
                  <button
                    className="w-full flex justify-between items-center p-6 text-left"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-${index}-panel`}
                    onClick={() => toggle(index)}
                  >
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-200 pr-8">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        flex-shrink-0 w-8 h-8 rounded-full 
                        bg-gray-100 dark:bg-gray-800 
                        flex items-center justify-center
                        group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30
                        transition-colors
                      `}
                    >
                      <ChevronDown
                        size={18}
                        className={`
                          transition-colors
                          ${
                            openIndex === index
                              ? "text-blue-500"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        `}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          id={`faq-${index}-panel`}
                          className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed"
                        >
                          {item.answer}

                          {/* Category tag */}
                          <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {item.category}
                            </span>
                          </div>
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
              <p className="text-gray-500 dark:text-gray-400">
                No questions found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
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
          className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Can't find the answer you're looking for? Please reach out to our
            friendly team.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <MessageCircle size={18} />
            <span>Contact Support</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
