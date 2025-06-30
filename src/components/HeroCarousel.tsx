import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    title: 'Holistic Healing with Ayurveda',
    subtitle: 'Experience the wisdom of ancient Ayurveda for a healthier, balanced life. Personalized care from our expert male doctors.',
  },
  {
    image: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1600&q=80',
    title: 'Empowering Wellness for Women',
    subtitle: 'Our female Ayurvedic specialists guide you on your journey to natural wellness and vitality.',
  },
  {
    image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80',
    title: 'Trusted Ayurvedic Team',
    subtitle: 'A dedicated team of Ayurvedic doctors committed to your holistic well-being and natural healing.',
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timeoutRef.current!);
  }, [current]);

  return (
    <section className="relative w-full md:w-screen md:left-1/2 md:right-1/2 md:-ml-[50vw] md:-mr-[50vw] overflow-hidden">
      <div className="relative w-full aspect-[3/4] sm:aspect-[16/9] md:w-screen md:aspect-auto md:h-[480px] lg:h-[600px] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <img
              src={banners[current].image}
              alt={banners[current].title}
              className="w-full h-full max-w-full object-cover object-center"
              style={{ filter: 'brightness(0.7)' }}
            />
            {/* Overlayed content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-6 sm:py-10">
              <motion.h2
                className="text-white text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg mb-2"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                key={banners[current].title}
              >
                {banners[current].title}
              </motion.h2>
              <motion.p
                className="text-white text-base sm:text-xl md:text-2xl font-medium drop-shadow mb-4"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                key={banners[current].subtitle}
              >
                {banners[current].subtitle}
              </motion.p>
              <motion.a
                href="/products"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                key="shop-products-btn"
              >
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all">
                  Shop Products
                </button>
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Dot navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10 mb-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
