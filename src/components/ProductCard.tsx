import { Phone, MessageCircle, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/api';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    benefits: string[];
    category: string;
    rating: number;
    reviews: number;
  };
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const phoneNumber = "8279277040";
  const whatsappMessage = `Hi, I'm interested in ${product.name}. Can you provide more details?`;

  return (
    <Card className={`group hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border-none overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md min-w-[280px] max-w-[370px] mx-auto`}>
      <div className="flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-72 md:h-64 lg:h-72 overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-contain md:object-cover object-center transition-transform duration-300 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Leaf className="h-4 w-4 mr-1" />
            {product.category}
          </Badge>
          {/* Best Seller Badge (demo) */}
          <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full shadow-lg font-bold">Best Seller</Badge>
          {/* Rating */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-sm">{product.rating}</span>
          </div>
        </div>
        {/* Text Section */}
        <div className="w-full flex flex-col justify-between">
          <CardContent className="space-y-2 p-4 md:p-6">
            <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-200 text-lg md:text-xl truncate">
              {product.name}
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm md:text-base">
              {product.description}
            </p>
            <div className="space-y-1">
              <h4 className="font-semibold text-xs md:text-sm text-foreground">Key Benefits:</h4>
              <ul className="space-y-0.5">
                {(product.benefits || []).slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-1 text-xs md:text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-xs md:text-sm">
              <span>{product.reviews} reviews</span>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">Natural & Safe</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex-col gap-2 w-full px-6 md:px-8 pb-4 md:pb-6">
            <div className="flex flex-col gap-2 w-full">
              {/* View Details Button */}
              {(product.id ?? product._id) !== undefined && (product.id ?? product._id) !== null && (
                <Button
                  size="lg"
                  className="w-full font-semibold py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 bg-primary text-white text-base md:text-lg"
                  asChild
                >
                  <Link to={`/product/${product.id ?? product._id}`}>
                    View Details
                  </Link>
                </Button>
              )}
              {/* Call Now Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 rounded-lg transition-all duration-200 text-base md:text-lg"
                asChild
              >
                <a href={`tel:${phoneNumber}`} className="flex items-center justify-center space-x-1">
                  <Phone className="h-5 w-5" />
                  <span>Call Now</span>
                </a>
              </Button>
              {/* WhatsApp Button */}
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 text-base md:text-lg"
                asChild
              >
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
