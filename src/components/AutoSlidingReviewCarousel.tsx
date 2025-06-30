import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const reviews = [
  {
    name: 'Rajesh Verma',
    image: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=160&q=80',
    text: 'I have been using their Ayurvedic products for 3 months. My digestion has improved a lot. Highly recommended!',
    city: 'Delhi'
  },
  {
    name: 'Amit Sharma',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=160&q=80',
    text: 'Very genuine and effective medicines. The doctor gave me great advice for my skin problems.',
    city: 'Mumbai'
  },
  {
    name: 'Vikas Patel',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&w=160&q=80',
    text: 'Fast delivery and good customer support. My joint pain is much better now.',
    city: 'Ahmedabad'
  },
  {
    name: 'Sunita Reddy',
    image: 'https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&w=160&q=80',
    text: 'I trust Balaji Healthcare for my family. Natural and safe products.',
    city: 'Hyderabad'
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

export default function AutoSlidingReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timeoutRef.current!);
  }, [current]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl min-h-[220px] sm:min-h-[280px] md:min-h-[400px] relative">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-4 sm:p-8 md:p-12 w-full h-full md:absolute md:inset-0"
          >
            <img
              src={reviews[current].image}
              alt={reviews[current].name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow mb-4"
            />
            <p className="text-lg text-foreground font-medium mb-2">"{reviews[current].text}"</p>
            <div className="text-sm text-muted-foreground mb-1 font-semibold">- {reviews[current].name}, {reviews[current].city}</div>
          </motion.div>
        </AnimatePresence>
        {/* Dots navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 