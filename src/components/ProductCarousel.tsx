import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Phone, MessageCircle, Leaf } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [carouselSettings, setCarouselSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCarouselContent();
  }, []);

  const fetchCarouselContent = async () => {
    // Fetch carousel settings
    const { data: settingsData } = await supabase
      .from('website_content')
      .select('*')
      .eq('section', 'product_carousel')
      .single();

    setCarouselSettings(settingsData);

    // Fetch active products for carousel
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);

    setFeaturedProducts(productsData || []);
    setIsLoading(false);
  };

  const phoneNumber = "8279277040";

  // Loading skeleton for product cards
  const ProductSkeleton = () => (
    <Card className="group border-border/50 overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Skeleton className="w-full aspect-[4/3]" />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex flex-col gap-2 w-full pt-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {carouselSettings?.title || "Featured Products"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {carouselSettings?.description || "Discover our premium Ayurvedic products designed for your wellness journey"}
          </p>
        </div>

        <Carousel
          plugins={[
            Autoplay({
              delay: carouselSettings?.content?.autoplay_delay || 4000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <AspectRatio ratio={4/3}>
                        <img
                          src={product.image_url}
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

                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {product.benefits?.slice(0, 2).map((benefit: string, index: number) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                            <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{product.reviews || 0} reviews</span>
                      <Badge variant="secondary" className="text-xs">100% Natural</Badge>
                    </div>

                    <div className="flex flex-col gap-2 w-full pt-2">
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                        asChild
                      >
                        <Link to={`/product/${product.id}`} className="flex items-center justify-center space-x-2">
                          <span className="text-sm">View Details</span>
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        asChild
                      >
                        <a
                          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Can you provide more details?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">WhatsApp</span>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default ProductCarousel;
