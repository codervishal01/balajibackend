import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Phone, MessageCircle, Leaf, Calendar, Eye } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import Autoplay from 'embla-carousel-autoplay';
import { Skeleton } from '@/components/ui/skeleton';
import { apiUrl, getImageUrl } from '@/lib/api';

interface CarouselSettings {
  content?: {
    autoplay_delay?: number;
    show_consultation_slide?: boolean;
    consultation_title?: string;
    consultation_subtitle?: string;
    consultation_button_text?: string;
  };
}

const HeroCarousel = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const AUTO_SLIDE_INTERVAL = 4000;

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(apiUrl('/api/banners'));
      const data = await res.json();
      setBanners(data || []);
    } catch (error) {
      setBanners([]);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, AUTO_SLIDE_INTERVAL);
      return () => clearTimeout(timeoutRef.current!);
    }
  }, [current, banners.length]);

  if (!banners.length) {
    return (
      <section className="relative w-full bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[260px] md:h-[480px] lg:h-[540px] flex items-center justify-center">
          <span className="text-lg text-muted-foreground">No banners available</span>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[260px] md:h-[480px] lg:h-[540px] bg-white flex items-center justify-center">
        {banners[current].image ? (
          <img
            src={getImageUrl(banners[current].image)}
            alt={banners[current].title || 'Banner'}
            className="w-full h-full object-contain object-center shadow-xl transition-all duration-700 md:rounded-2xl"
            style={{ background: '#fff', maxHeight: '100%', maxWidth: '100%' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-200 to-emerald-100 shadow-xl p-3 md:p-8 text-center md:rounded-2xl">
            <div className="flex-1 flex flex-col items-center md:items-start justify-center">
              <h2 className="text-lg sm:text-xl md:text-4xl font-bold text-primary mb-2 md:mb-4 break-words max-w-xs md:max-w-full mx-auto md:mx-0">
                {banners[current].title}
              </h2>
              <p className="text-xs sm:text-base md:text-xl text-muted-foreground mb-3 md:mb-6 max-w-xs md:max-w-xl mx-auto md:mx-0 break-words">
                {banners[current].subtitle}
              </p>
              {banners[current].cta && (
                <a href={banners[current].ctaLink || '/contact'}>
                  <button className="px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-lg font-semibold text-sm md:text-lg shadow hover:bg-primary/90 transition-all w-full md:w-auto">
                    {banners[current].cta}
                  </button>
                </a>
              )}
            </div>
          </div>
        )}
        {/* Dot navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
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
