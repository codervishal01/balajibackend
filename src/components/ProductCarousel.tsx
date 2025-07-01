import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Phone, MessageCircle, Leaf } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router-dom';
import { apiUrl, getImageUrl } from '@/lib/api';

const ProductCarousel = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(apiUrl('/api/products'));
      const data = await res.json();
      setFeaturedProducts(data.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Carousel plugins={[Autoplay({ delay: 4000 })]}>
        <CarouselContent className="gap-x-6 md:gap-x-8 px-4 md:px-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CarouselItem key={idx} className="w-full sm:max-w-[320px] md:max-w-[350px] lg:max-w-[370px] flex-shrink-0">
                <Skeleton className="h-64 w-full rounded-lg" />
              </CarouselItem>
            ))
          ) : (
            featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="w-full sm:max-w-[320px] md:max-w-[350px] lg:max-w-[370px] flex-shrink-0">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <AspectRatio ratio={4/3}>
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          style={{ objectPosition: 'center' }}
                          loading="lazy"
                          decoding="async"
                        />
                      </AspectRatio>
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg">
                        <Leaf className="h-3 w-3 mr-1" />
                        {product.category}
                      </Badge>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold">{product.rating}</span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col gap-2 min-h-[370px]">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary font-semibold">₹{product.price}</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <Link to={`/product/${product.id ?? product._id}`} className="block w-full">
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="w-full"
                        variant="outline"
                        asChild
                      >
                        <a href={`tel:8279277040`} className="flex items-center justify-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>Call Now</span>
                        </a>
                      </Button>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                        asChild
                      >
                        <a
                          href={`https://wa.me/8279277040?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Can you provide more details?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
