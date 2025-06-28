import { Phone, MessageCircle, Star, Leaf, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getImageUrl } from '@/lib/api';

interface ProductDetailModalProps {
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
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const phoneNumber = "8279277040"; // Updated phone number
  const whatsappMessage = `Hi, I'm interested in ${product.name}. Can you provide more details?`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground">Product Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg">
                <AspectRatio ratio={1.5}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-88 object-cover rounded-t-lg"
                  />
                </AspectRatio>
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  <Leaf className="h-4 w-4 mr-2" />
                  {product.category}
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm font-semibold ml-2">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quality Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Natural & Safe</Badge>
                <Badge variant="secondary">Lab Tested</Badge>
                <Badge variant="secondary">Ayurvedic</Badge>
                <Badge variant="secondary">Chemical Free</Badge>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`} className="flex items-center justify-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Call Now: {phoneNumber}</span>
                  </a>
                </Button>

                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  asChild
                >
                  <a
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp Consultation</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
