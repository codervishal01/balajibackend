import { useState, useEffect } from 'react';
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
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [carouselSettings, setCarouselSettings] = useState<CarouselSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCarouselSettings();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4);

    setFeaturedProducts(productsData || []);
    setIsLoading(false);
  };

  const fetchCarouselSettings = async () => {
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .eq('section', 'hero_carousel')
      .single();

    if (data) {
      setCarouselSettings({
        content: data.content as CarouselSettings['content']
      });
    }
  };

  const phoneNumber = "8279277040";

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const autoplayDelay = carouselSettings?.content?.autoplay_delay || 4000;
  const showConsultationSlide = carouselSettings?.content?.show_consultation_slide !== false;
  const consultationTitle = carouselSettings?.content?.consultation_title || 'Book Your Free Ayurvedic Consultation';
  const consultationSubtitle = carouselSettings?.content?.consultation_subtitle || 'Talk to our certified Ayurvedic expert today';
  const consultationButtonText = carouselSettings?.content?.consultation_button_text || 'Consult Now - FREE';

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="relative py-8 md:py-12">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {/* Mobile Layout Skeleton */}
          <div className="block md:hidden">
            <div className="text-center space-y-6">
              <div className="relative max-w-[280px] mx-auto">
                <Skeleton className="w-full aspect-square rounded-2xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-16 w-full max-w-xs mx-auto" />
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout Skeleton */}
          <div className="hidden md:block">
            <div className="grid md:grid-cols-2 items-center gap-8 min-h-[400px]">
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-28" />
                </div>
              </div>
              <div className="flex justify-center">
                <Skeleton className="w-[320px] aspect-square rounded-2xl" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading || !featuredProducts.length) {
    return (
      <section className="relative w-full bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  // Add static wellness banners
  const wellnessBanners = [
    {
      image: "/wellness-banner1.jpg",
      title: "Holistic Wellness for Mind & Body",
      subtitle: "Experience the power of Ayurveda for a healthier, happier you.",
      cta: "Start Your Wellness Journey"
    },
    {
      image: "/wellness-banner2.jpg",
      title: "Natural Healing, Trusted by Generations",
      subtitle: "Discover authentic remedies and expert guidance.",
      cta: "Explore Our Solutions"
    },
    {
      image: "/wellness-banner3.jpg",
      title: "Personalized Ayurvedic Care",
      subtitle: "Consult with certified practitioners for your unique needs.",
      cta: "Book a Free Consultation"
    }
  ];

  return (
    <section className="relative w-full bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          plugins={[
            Autoplay({
              delay: autoplayDelay,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {/* Featured Products Slides */}
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-full">
                <div className="relative py-8 md:py-12">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="p-0">
                      {/* Mobile Layout */}
                      <div className="block md:hidden">
                        <div className="text-center space-y-6">
                          {/* Product Image - Mobile */}
                          <div className="relative max-w-[280px] mx-auto">
                            <AspectRatio ratio={1}>
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-2xl shadow-2xl ring-4 ring-white/50 cursor-pointer"
                                onClick={() => handleProductClick(product)}
                                loading="lazy"
                                decoding="async"
                              />
                            </AspectRatio>
                            <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                              <Leaf className="h-3 w-3 mr-1" />
                              {product.category}
                            </Badge>
                            <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-1 shadow-lg">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                            </div>
                          </div>

                          {/* Product Info - Mobile */}
                          <div className="space-y-4">
                            <div>
                              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {product.name}
                              </h1>
                              <p className="text-base text-amber-700 font-medium mb-3">
                                Natural Healing for You
                              </p>
                              <p className="text-gray-600 text-sm leading-relaxed px-4">
                                {product.description}
                              </p>
                            </div>

                            {/* Action Buttons - Mobile */}
                            <div className="flex flex-col gap-3 max-w-xs mx-auto">
                              <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => handleProductClick(product)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                                  onClick={scrollToProducts}
                                >
                                  Shop Now
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                                  asChild
                                >
                                  <a
                                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Can you provide more details?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-1"
                                  >
                                    <MessageCircle className="h-4 w-4" />
                                    <span>WhatsApp</span>
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:block">
                        <div className="grid md:grid-cols-2 items-center gap-8 min-h-[400px]">
                          {/* Product Info - Desktop (Left Side) */}
                          <div className="space-y-6">
                            <div>
                              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                {product.name}
                              </h1>
                              <p className="text-xl text-amber-700 font-medium mb-6">
                                Natural Healing for You
                              </p>
                              <p className="text-gray-600 text-lg leading-relaxed">
                                {product.description}
                              </p>
                            </div>

                            {/* Key Benefits - Desktop */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Key Benefits:</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {product.benefits?.slice(0, 3).map((benefit: string, index: number) => (
                                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons - Desktop */}
                            <div className="flex gap-3">
                              <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => handleProductClick(product)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>

                              <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                onClick={scrollToProducts}
                              >
                                Shop Now
                              </Button>

                              <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                asChild
                              >
                                <a
                                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Can you provide more details?`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center space-x-2"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>WhatsApp</span>
                                </a>
                              </Button>
                            </div>
                          </div>

                          {/* Product Image - Desktop (Right Side) */}
                          <div className="flex justify-center">
                            <div className="relative max-w-[320px] w-full">
                              <AspectRatio ratio={1}>
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-2xl shadow-2xl ring-4 ring-white/50 cursor-pointer"
                                  onClick={() => handleProductClick(product)}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </AspectRatio>
                              <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                                <Leaf className="h-3 w-3 mr-1" />
                                {product.category}
                              </Badge>
                              <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-1 shadow-lg">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}

            {/* Free Consultation Slide */}
            {showConsultationSlide && (
              <CarouselItem className="basis-full">
                <div className="relative py-8 md:py-12 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-2xl mx-4 sm:mx-6 lg:mx-8">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] px-6">
                        <div className="text-center space-y-6 max-w-2xl mx-auto">
                          <div className="space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                              <Calendar className="h-8 w-8 md:h-10 md:w-10 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
                              {consultationTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 font-medium">
                              {consultationSubtitle}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <Button
                              size="lg"
                              className="bg-white text-amber-600 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                              onClick={scrollToContact}
                            >
                              {consultationButtonText}
                            </Button>

                            <Button
                              size="lg"
                              variant="outline"
                              className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                              asChild
                            >
                              <a
                                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hi, I would like to book a free Ayurvedic consultation.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2"
                              >
                                <MessageCircle className="h-5 w-5" />
                                <span>WhatsApp</span>
                              </a>
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-6 text-white/90 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-lg">100%</div>
                              <div>Natural</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-lg">15+</div>
                              <div>Years Exp.</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-lg">1000+</div>
                              <div>Happy Clients</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )}

            {/* Wellness Banners */}
            {wellnessBanners.map((banner, idx) => (
              <CarouselItem key={idx} className="basis-full">
                <div className="relative py-8 md:py-12">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 items-center gap-8 min-h-[400px]">
                        <div className="space-y-6 text-center md:text-left">
                          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            {banner.title}
                          </h2>
                          <p className="text-lg md:text-xl text-muted-foreground mb-6">
                            {banner.subtitle}
                          </p>
                          <Button size="lg" className="gradient-bg text-white font-semibold px-8 py-4 text-lg shadow-lg hover:scale-105 transition-transform duration-200">
                            {banner.cta}
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <AspectRatio ratio={4/3}>
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="w-full h-full object-cover rounded-2xl shadow-2xl ring-4 ring-white/50"
                              loading="lazy"
                              decoding="async"
                            />
                          </AspectRatio>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation */}
          <CarouselPrevious className="hidden md:flex left-4 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-lg" />
          <CarouselNext className="hidden md:flex right-4 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-lg" />
        </Carousel>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/10 rounded-full blur-lg"></div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          isOpen={showProductModal} 
          onClose={() => setShowProductModal(false)} 
        />
      )}
    </section>
  );
};

export default HeroCarousel;
