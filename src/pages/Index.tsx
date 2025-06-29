import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Shield, Heart, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AutoSlidingReviewCarousel from '@/components/AutoSlidingReviewCarousel';
import { apiUrl } from '@/lib/api';

// Lazy load heavy components
const ProductCarousel = lazy(() => import('@/components/ProductCarousel'));

const Index = () => {
  const [featuredProductsContent, setFeaturedProductsContent] = useState<any>(null);
  const [testimonialsContent, setTestimonialsContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchHomePageContent();
    fetchAllProducts();
  }, []);

  const fetchHomePageContent = async () => {
    try {
      const { data } = await supabase
        .from('website_content')
        .select('*')
        .in('section', ['featured_products', 'testimonials']);

      if (data) {
        data.forEach(item => {
          switch (item.section) {
            case 'featured_products':
              setFeaturedProductsContent(item);
              break;
            case 'testimonials':
              setTestimonialsContent(item);
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(apiUrl('/api/products'));
      const data = await res.json();
      setAllProducts(data || []);
    } catch (error) {
      setAllProducts([]);
    }
  };

  // Fallback data in case database content is not available
  const defaultFeaturedProducts = [
    {
      id: 1,
      name: "Triphala Churna",
      description: "Ancient digestive formula for complete detoxification and bowel regularity.",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
      benefits: ["Improves digestion", "Natural detox", "Boosts immunity", "Enhances metabolism"],
      category: "Digestive Health",
      rating: 4.8,
      reviews: 245
    },
    {
      id: 2,
      name: "Ashwagandha Capsules",
      description: "Premium quality stress relief and energy enhancement supplement.",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80",
      benefits: ["Reduces stress", "Improves energy", "Better sleep", "Mental clarity"],
      category: "Wellness",
      rating: 4.9,
      reviews: 189
    },
    {
      id: 3,
      name: "Herbs Natural Hair Oil",
      description: "Premium blend of natural herbs for healthy hair growth and reduced hair fall.",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80",
      benefits: ["Promotes hair growth", "Reduces hair fall", "Nourishes scalp", "Natural shine"],
      category: "Hair Care",
      rating: 4.8,
      reviews: 156
    }
  ];

  const defaultTestimonials = [
    {
      name: "Priya Sharma",
      text: "The Triphala has completely transformed my digestive health. Highly recommend!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      text: "Ashwagandha capsules helped me manage stress naturally. Excellent quality!",
      rating: 5
    },
    {
      name: "Meera Patel",
      text: "The Hair Oil is amazing! My hair fall has reduced significantly.",
      rating: 5
    }
  ];

  const featuredProducts = featuredProductsContent?.content?.products || defaultFeaturedProducts;
  const testimonials = testimonialsContent?.content?.testimonials || defaultTestimonials;

  // Loading skeletons
  const ProductSkeleton = () => (
    <Card className="border-border/50 overflow-hidden">
      <div className="relative overflow-hidden rounded-t-lg">
        <Skeleton className="w-full aspect-[4/3]" />
      </div>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const TestimonialSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero/Banner Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-4">
        <div className="w-full px-0">
          <HeroCarousel heightClass="h-40 md:h-56 lg:h-60" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-3">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
            About Balaji HealthCare
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-2">
            Bridging ancient Ayurvedic wisdom with modern wellness needs, Balaji HealthCare offers authentic, natural solutions for your holistic health. Our mission is to empower you to live a healthier, more balanced life through time-tested remedies and expert guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center w-64">
              <Leaf className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold text-lg">100% Natural</span>
              <span className="text-sm text-muted-foreground mt-1">Pure herbal ingredients</span>
            </div>
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center w-64">
              <Shield className="h-8 w-8 text-blue-500 mb-2" />
              <span className="font-semibold text-lg">Lab Tested</span>
              <span className="text-sm text-muted-foreground mt-1">Quality assured products</span>
            </div>
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center w-64">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <span className="font-semibold text-lg">Holistic Healing</span>
              <span className="text-sm text-muted-foreground mt-1">Mind, body & soul wellness</span>
            </div>
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center w-64">
              <Star className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="font-semibold text-lg">Trusted by Thousands</span>
              <span className="text-sm text-muted-foreground mt-1">Proven results & happy customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-2">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
              {featuredProductsContent?.title || "Featured Products"}
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              {featuredProductsContent?.description || "Discover our most popular Ayurvedic formulations, crafted with authentic ingredients and time-tested recipes."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-2 justify-center">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              allProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          <div className="text-center">
            <Button size="sm" variant="outline" className="hover:bg-primary hover:text-white" asChild>
              <a href="/products" className="flex items-center space-x-2">
                <span>View All Products</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Sliding Reviews Section */}
      <section className="py-3 bg-gradient-to-br from-accent/10 to-primary/5">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="relative">
            <div className="w-full overflow-hidden rounded-2xl shadow-xl">
              <div className="relative">
                <AutoSlidingReviewCarousel imagesOnly compact={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Balaji Healthcare?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our authentic Ayurvedic approach to health and wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8" />,
                title: "Pure & Natural",
                description: "100% natural ingredients sourced from certified organic farms"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Quality Assured",
                description: "Rigorous testing and quality control for every product"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Holistic Approach",
                description: "Complete wellness solutions for mind, body, and spirit"
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Expert Guidance",
                description: "Personalized consultations with experienced practitioners"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get personalized Ayurvedic consultation and discover the right products for your unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="tel:8279277040" className="flex items-center space-x-2">
                <span>Call for Consultation</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
