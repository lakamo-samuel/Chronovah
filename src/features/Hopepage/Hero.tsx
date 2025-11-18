import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const images = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
    "/images/hero4.jpg",
    "/images/hero5.jpg",
    "/images/hero6.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  //  const prevSlide = () =>
  //    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  //  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  //  const goToSlide = (index) => setCurrent(index);

  return (
    <section className="text-center px-6 py-14 relative">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center z-0 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url(${img}) ` }}
        />
      ))}

      {/* Gradient overlay above images */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-700 to-gray-900 opacity-90 z-5"></div>

      {/* Text content wrapper explicitly on top */}
      <div className="hero-content relative z-20 inline-block w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl z-100 font-bold text-primary mb-3"
        >
          Life Panel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg opacity-80 z-100"
        >
          Organize your Places, People & Notes — all in one simple dashboard.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.92 }}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-md"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Enter App
        </motion.button>
      </div>
    </section>
  );
}
