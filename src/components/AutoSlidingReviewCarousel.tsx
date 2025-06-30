import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl, getImageUrl } from '@/lib/api';

const AUTO_SLIDE_INTERVAL = 4000;

export default function AutoSlidingReviewCarousel() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(apiUrl('/api/reviews'));
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Error loading reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timeoutRef.current!);
  }, [current, reviews.length]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-xl min-h-[220px] flex items-center justify-center">
          <span className="text-muted-foreground">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-xl min-h-[220px] flex items-center justify-center">
          <span className="text-destructive">{error}</span>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-xl min-h-[220px] flex items-center justify-center">
          <span className="text-muted-foreground">No reviews yet.</span>
        </div>
      </div>
    );
  }

  const currentReview = reviews[current];

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
              src={getImageUrl(currentReview.image)}
              alt={currentReview.name || 'Customer'}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow mb-4"
            />
            <p className="text-lg text-foreground font-medium mb-2">"{currentReview.text}"</p>
            <div className="text-sm text-muted-foreground mb-1 font-semibold">
              - {currentReview.name || 'Customer'}{currentReview.city ? `, ${currentReview.city}` : ''}
            </div>
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