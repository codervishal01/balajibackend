
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CarouselContent {
  autoplay_delay?: number;
  show_consultation_slide?: boolean;
  consultation_title?: string;
  consultation_subtitle?: string;
  consultation_button_text?: string;
}

const HeroCarouselEditor = () => {
  const [carouselContent, setCarouselContent] = useState({
    title: 'Hero Carousel',
    description: 'Main product showcase carousel',
    autoplay_delay: 4000,
    show_consultation_slide: true,
    consultation_title: 'Book Your Free Ayurvedic Consultation',
    consultation_subtitle: 'Talk to our certified Ayurvedic expert today',
    consultation_button_text: 'Consult Now - FREE'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCarouselContent();
  }, []);

  const fetchCarouselContent = async () => {
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .eq('section', 'hero_carousel')
      .single();

    if (data) {
      const content = data.content as CarouselContent;
      setCarouselContent({
        title: data.title || 'Hero Carousel',
        description: data.description || 'Main product showcase carousel',
        autoplay_delay: content?.autoplay_delay || 4000,
        show_consultation_slide: content?.show_consultation_slide !== false,
        consultation_title: content?.consultation_title || 'Book Your Free Ayurvedic Consultation',
        consultation_subtitle: content?.consultation_subtitle || 'Talk to our certified Ayurvedic expert today',
        consultation_button_text: content?.consultation_button_text || 'Consult Now - FREE'
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    const contentData = {
      section: 'hero_carousel',
      title: carouselContent.title,
      description: carouselContent.description,
      content: {
        autoplay_delay: carouselContent.autoplay_delay,
        show_consultation_slide: carouselContent.show_consultation_slide,
        consultation_title: carouselContent.consultation_title,
        consultation_subtitle: carouselContent.consultation_subtitle,
        consultation_button_text: carouselContent.consultation_button_text
      }
    };

    const { error } = await supabase
      .from('website_content')
      .upsert(contentData, { onConflict: 'section' });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update hero carousel settings",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Hero carousel settings updated successfully"
      });
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Carousel Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={carouselContent.title}
              onChange={(e) => setCarouselContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Hero Carousel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoplay_delay">Autoplay Delay (ms)</Label>
            <Input
              id="autoplay_delay"
              type="number"
              value={carouselContent.autoplay_delay}
              onChange={(e) => setCarouselContent(prev => ({ ...prev, autoplay_delay: parseInt(e.target.value) || 4000 }))}
              placeholder="4000"
              min="1000"
              max="10000"
              step="500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={carouselContent.description}
            onChange={(e) => setCarouselContent(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Main product showcase carousel"
            rows={2}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Consultation Slide Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show_consultation_slide"
                checked={carouselContent.show_consultation_slide}
                onCheckedChange={(checked) => setCarouselContent(prev => ({ ...prev, show_consultation_slide: checked }))}
              />
              <Label htmlFor="show_consultation_slide">Show Consultation Slide</Label>
            </div>

            {carouselContent.show_consultation_slide && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="consultation_title">Consultation Title</Label>
                  <Input
                    id="consultation_title"
                    value={carouselContent.consultation_title}
                    onChange={(e) => setCarouselContent(prev => ({ ...prev, consultation_title: e.target.value }))}
                    placeholder="Book Your Free Ayurvedic Consultation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation_subtitle">Consultation Subtitle</Label>
                  <Input
                    id="consultation_subtitle"
                    value={carouselContent.consultation_subtitle}
                    onChange={(e) => setCarouselContent(prev => ({ ...prev, consultation_subtitle: e.target.value }))}
                    placeholder="Talk to our certified Ayurvedic expert today"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation_button_text">Consultation Button Text</Label>
                  <Input
                    id="consultation_button_text"
                    value={carouselContent.consultation_button_text}
                    onChange={(e) => setCarouselContent(prev => ({ ...prev, consultation_button_text: e.target.value }))}
                    placeholder="Consult Now - FREE"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Hero Carousel Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroCarouselEditor;
