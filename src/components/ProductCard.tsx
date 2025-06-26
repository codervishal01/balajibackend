
import { Phone, MessageCircle, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

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
}

const ProductCard = ({ product }: ProductCardProps) => {
  const phoneNumber = "8279277040";
  const whatsappMessage = `Hi, I'm interested in ${product.name}. Can you provide more details?`;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <AspectRatio ratio={4/3}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              style={{ objectPosition: 'center' }}
            />
          </AspectRatio>
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            <Leaf className="h-3 w-3 mr-1" />
            {product.category}
          </Badge>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Key Benefits:</h4>
          <ul className="space-y-1">
            {product.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{product.reviews} reviews</span>
          <Badge variant="secondary" className="text-xs">Natural & Safe</Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0 space-y-3">
        <div className="flex flex-col gap-3 w-full">
          {/* View Details Button */}
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            asChild
          >
            <Link to={`/product/${product.id}`}>
              View Details
            </Link>
          </Button>
          
          {/* Call Now Button */}
          <Button
            size="lg"
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            asChild
          >
            <a href={`tel:${phoneNumber}`} className="flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5" />
              <span className="text-sm font-medium">Call Now</span>
            </a>
          </Button>

          {/* WhatsApp Button */}
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            asChild
          >
            <a
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
