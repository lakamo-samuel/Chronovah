import { motion } from "framer-motion";
import { MapPin, Users, NotebookPen, Book } from "lucide-react";



export default function Features() {
    
    const features = [
      {
        title: "Places",
        desc: "Save locations, memories, photos, and places you’ve been.",
        icon: (
          <MapPin
            size={30}
            className="text-primary text-blue-800 dark:text-blue-400"
          />
        ),
      },
      {
        title: "Notes",
        desc: "Save ideas, reminders, lists, and everything on your mind.",
        icon: (
          <NotebookPen className="w-6 h-6 text-yellow-900 dark:text-yellow-400" />
        ),
      },
      {
        title: "People",
        desc: "Store details about friends, family, clients, and relationships.",
        icon: (
          <Users
            size={30}
            className="text-primary text-green-900 dark:text-green-400"
          />
        ),
      },

      {
        title: "Journal",
        desc: "Track your thoughts, mood, and daily emotional progress.",
        icon: (
          <Book
            size={30}
            className="text-primary  text-purple-900 dark:text-purple-400"
          />
        ),
      },
    ];

  return (
    <section id="features" className="px-6 md:px-12 py-16 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        What Cronova Helps You Manage
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((f,i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white/5 dark:bg-black/20 text-gray-900  border-white/10 backdrop-blur-sm rounded-xl shadow-sm p-6    hover:shadow-md transition border"
          >
            <div className="text-4xl mb-4 bg-white w-fit p-4 rounded-2xl shadow-2xl">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-700">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
