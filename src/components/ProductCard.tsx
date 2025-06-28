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
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden ${compact ? 'p-1' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="sm:w-1/2 w-full flex items-center justify-center bg-white p-2">
          <div className="relative w-full">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className={`w-full h-60 sm:h-96 object-contain group-hover:scale-105 transition-transform duration-300 bg-white ${compact ? 'object-contain h-20' : ''}`}
              style={{ objectPosition: 'center' }}
            />
            <Badge className={`absolute top-2 left-2 bg-primary text-primary-foreground ${compact ? 'text-[10px] px-1 py-0.5' : ''}`}>
              <Leaf className="h-4 w-2 mr-1" />
              {product.category}
            </Badge>
            <div className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-1 py-0.5 flex items-center space-x-1 ${compact ? 'text-[10px]' : ''}`}>
              <Star className="h-2 w-2 text-yellow-400 fill-current" />
              <span className="font-semibold">{product.rating}</span>
            </div>
          </div>
        </div>
        {/* Text Section */}
        <div className="sm:w-1/2 w-full flex flex-col justify-between">
          <CardContent className={`space-y-1 ${compact ? 'p-1 text-[11px]' : 'p-4 sm:p-6'}`}>
            <div>
              <h3 className={`font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-200 ${compact ? 'text-xs' : 'text-lg sm:text-xl'}`}>
                {product.name}
              </h3>
              <p className={`text-muted-foreground mt-1 line-clamp-2 ${compact ? 'text-[10px]' : 'text-sm'}`}>
                {product.description}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className={`font-semibold ${compact ? 'text-[10px]' : 'text-sm'} text-foreground`}>Key Benefits:</h4>
              <ul className="space-y-0.5">
                {(product.benefits || []).slice(0, 3).map((benefit, index) => (
                  <li key={index} className={`flex items-center space-x-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                    <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`flex items-center justify-between text-muted-foreground ${compact ? 'text-[10px]' : 'text-xs'}`}>
              <span>{product.reviews} reviews</span>
              <Badge variant="secondary" className={`text-xs ${compact ? 'px-1 py-0.5' : ''}`}>Natural & Safe</Badge>
            </div>
          </CardContent>
          <CardFooter className={`pt-0 space-y-1 ${compact ? 'p-1' : 'p-4 sm:p-6'} flex-col gap-1 w-full`}>
            <div className="flex flex-col gap-1 w-full">
              {/* View Details Button */}
              <Button
                size={compact ? 'sm' : 'lg'}
                className={`w-full font-semibold py-2 px-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${compact ? 'text-xs' : ''}`}
                asChild
              >
                <Link to={`/product/${product.id}`}>
                  View Details
                </Link>
              </Button>
              {/* Call Now Button */}
              <Button
                size={compact ? 'sm' : 'lg'}
                variant="outline"
                className={`w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-2 px-2 rounded-lg transition-all duration-200 ${compact ? 'text-xs' : ''}`}
                asChild
              >
                <a href={`tel:${phoneNumber}`} className="flex items-center justify-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </a>
              </Button>
              {/* WhatsApp Button */}
              <Button
                size={compact ? 'sm' : 'lg'}
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${compact ? 'text-xs' : ''}`}
                asChild
              >
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1"
                >
                  <MessageCircle className="h-4 w-4" />
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
