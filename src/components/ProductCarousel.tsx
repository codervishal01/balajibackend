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
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CarouselItem key={idx} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Skeleton className="h-64 w-full rounded-lg" />
              </CarouselItem>
            ))
          ) : (
            featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
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
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary font-semibold">₹{product.price}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="block w-full">
                      <Button className="w-full mt-2" variant="outline">
                        View Details
                      </Button>
                    </Link>
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
