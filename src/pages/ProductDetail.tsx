import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageCircle, Star, Leaf, ArrowLeft, Shield, Heart, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', id)
        .limit(3);

      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const phoneNumber = "8279277040";
  const whatsappMessage = product ? `Hi, I'm interested in ${product.name}. Can you provide more details?` : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <AspectRatio ratio={1}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
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
              <h1 className="text-4xl font-bold text-foreground mb-4">
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
                  <span className="text-lg font-semibold ml-2">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quality Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Leaf className="h-3 w-3" />
                <span>100% Natural</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Lab Tested</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>Ayurvedic</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Award className="h-3 w-3" />
                <span>Chemical Free</span>
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
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

        {/* Benefits Section */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <AspectRatio ratio={4/3}>
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          style={{ objectPosition: 'center' }}
                        />
                      </AspectRatio>
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        <Leaf className="h-3 w-3 mr-1" />
                        {relatedProduct.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg">{relatedProduct.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <Button className="w-full" asChild>
                      <Link to={`/product/${relatedProduct.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
