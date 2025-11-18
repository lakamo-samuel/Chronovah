import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Items",
      desc: "Add notes, people, places, and journal entries effortlessly.",
    },
    {
      number: "2",
      title: "Organize Your Life",
      desc: "Use tags, search, filters, and quick access to manage everything.",
    },
    {
      number: "3",
      title: "View Everything in One Dashboard",
      desc: "Your entire life — structured and easy to review anytime.",
    },
  ];

  return (
    <section className="px-6 md:px-12 py-16 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        How It Works
      </h2>

      <div className="max-w-4xl mx-auto space-y-8">
        {steps.map((s,i) => (
            
        <motion.div
            key={s.number}
            initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                
            transition={{ delay: i * 0.15 }}
            className="flex  transition  gap-6 items-start p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 "
          >
          
           
          
            <div className="text-4xl font-bold text-blue-600">{s.number}</div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
