import { ArrowRight, Leaf, Star, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HeroSectionProps {
  heroContent?: {
    title: string;
    description: string;
    image_url: string;
  } | null;
}

const HeroSection = ({ heroContent }: HeroSectionProps) => {
  const features = [
    {
      icon: <Leaf className="h-6 w-6 text-primary" />,
      title: "100% Natural",
      description: "Pure herbal ingredients"
    },
    {
      icon: <Star className="h-6 w-6 text-accent" />,
      title: "Proven Results",
      description: "Time-tested formulations"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Holistic Healing",
      description: "Mind, body & soul wellness"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Safe & Effective",
      description: "No harmful side effects"
    }
  ];

  const title = heroContent?.title || "Ancient Wisdom for Modern Wellness";
  const description = heroContent?.description || "Discover the healing power of authentic Ayurvedic medicines. Our time-tested formulations bring you natural solutions for lasting health and vitality.";
  const heroImage = heroContent?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-primary/10 leaf-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                {title.includes('Modern Wellness') ? (
                  <>
                    {title.split('Modern Wellness')[0]}
                    <span className="text-primary block">Modern Wellness</span>
                  </>
                ) : (
                  <span className="text-primary">{title}</span>
                )}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-bg text-white hover:scale-105 transition-transform duration-200">
                <a href="tel:8279277040" className="flex items-center space-x-2">
                  <span>Consult Now</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="hover:bg-primary hover:text-white transition-colors duration-200">
                <a href="#products">View Products</a>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-none bg-transparent hover:bg-card/50 transition-colors duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-background rounded-lg shadow-sm">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Ayurvedic herbs and medicines"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">5.0</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">1000+ Happy Customers</p>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">100% Natural</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Certified Organic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
