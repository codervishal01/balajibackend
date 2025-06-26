
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductCarouselContent {
  autoplay_delay?: number;
  show_arrows?: boolean;
  show_dots?: boolean;
}

const ProductCarouselEditor = () => {
  const [content, setContent] = useState({
    title: 'Featured Products',
    description: 'Discover our premium Ayurvedic products designed for your wellness journey',
    content: {
      autoplay_delay: 4000,
      show_arrows: true,
      show_dots: true
    }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .eq('section', 'product_carousel')
      .single();

    if (data) {
      const carouselContent = data.content as ProductCarouselContent;
      setContent({
        title: data.title || 'Featured Products',
        description: data.description || 'Discover our premium Ayurvedic products designed for your wellness journey',
        content: {
          autoplay_delay: carouselContent?.autoplay_delay || 4000,
          show_arrows: carouselContent?.show_arrows !== false,
          show_dots: carouselContent?.show_dots !== false
        }
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    const { error } = await supabase
      .from('website_content')
      .upsert({
        section: 'product_carousel',
        title: content.title,
        description: content.description,
        content: content.content
      }, { onConflict: 'section' });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update product carousel settings",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Product carousel settings updated successfully"
      });
    }
    
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product Carousel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={content.title || ''}
            onChange={(e) => setContent({
              ...content,
              title: e.target.value
            })}
            placeholder="Featured Products"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={content.description || ''}
            onChange={(e) => setContent({
              ...content,
              description: e.target.value
            })}
            placeholder="Discover our premium Ayurvedic products..."
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Autoplay Delay (milliseconds)</label>
          <Input
            type="number"
            min="2000"
            max="10000"
            step="500"
            value={content.content?.autoplay_delay || 4000}
            onChange={(e) => setContent({
              ...content,
              content: {
                ...content.content,
                autoplay_delay: parseInt(e.target.value) || 4000
              }
            })}
            placeholder="4000"
          />
          <p className="text-xs text-muted-foreground mt-1">
            How long each product is displayed (2-10 seconds recommended)
          </p>
        </div>

        <div className="bg-secondary/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Carousel Settings</h4>
          <p className="text-sm text-muted-foreground">
            The carousel will automatically display active products from your Products section. 
            Make sure products are marked as "Active" to appear in the carousel.
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCarouselEditor;
