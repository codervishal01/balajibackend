import { useEffect, useRef, useState } from 'react';
import { apiUrl, getImageUrl } from '@/lib/api';

const AUTO_SLIDE_INTERVAL = 4000;

interface AutoSlidingReviewCarouselProps {
  imagesOnly?: boolean;
  compact?: boolean;
}

export default function AutoSlidingReviewCarousel({ imagesOnly = false, compact = false }: AutoSlidingReviewCarouselProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(apiUrl('/api/reviews'));
      const data = await res.json();
      setReviews(data || []);
    } catch (error) {
      setReviews([]);
    }
  };

  useEffect(() => {
    if (reviews.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % reviews.length);
      }, AUTO_SLIDE_INTERVAL);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [current, reviews.length]);

  if (!reviews.length) {
    return (
      <div className="relative w-full h-80 flex items-center justify-center">
        <span className="text-lg text-muted-foreground">No reviews available</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center w-full ${compact ? 'py-2' : 'py-6'}`}>
      <div className={`flex gap-0 w-full overflow-x-auto items-center ${compact ? 'h-32' : 'h-36 md:h-48'}`}>
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {imagesOnly ? (
              <div className="flex items-center justify-center h-full w-full">
                <img
                  src={getImageUrl(review.image)}
                  alt={`Customer review ${idx + 1}`}
                  className={`rounded-lg object-contain mx-auto ${compact ? 'h-32 w-32' : 'h-48 w-48 md:h-64 md:w-64'}`}
                  style={{ maxWidth: '100%' }}
                />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center h-full bg-white/90 shadow-2xl p-6 md:p-10 rounded-2xl">
                <img
                  src={getImageUrl(review.image)}
                  alt={`Customer review ${idx + 1}`}
                  className={`w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-lg mb-6 md:mb-0 md:mr-10 border-4 border-primary ${compact ? 'h-32 w-32' : 'h-48 w-48 md:h-64 md:w-64'}`}
                />
                {/* Text and name would go here if not imagesOnly */}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {reviews.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-primary' : 'bg-muted-foreground/30'} transition-colors`}
          />
        ))}
      </div>
    </div>
  );
} 