
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCarouselEditor from '@/components/ProductCarouselEditor';
import HeroCarouselEditor from '@/components/HeroCarouselEditor';
import HomePageEditor from '@/components/HomePageEditor';
import AboutPageEditor from '@/components/AboutPageEditor';
import ContactPageEditor from '@/components/ContactPageEditor';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [homeContent, setHomeContent] = useState<any>(null);
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [contactContent, setContactContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      fetchContent();
    }
  }, [user, isAdmin]);

  const fetchContent = async () => {
    try {
      const { data } = await supabase
        .from('website_content')
        .select('*')
        .in('section', ['home_hero', 'about_page', 'contact_page']);

      if (data) {
        data.forEach(item => {
          switch (item.section) {
            case 'home_hero':
              setHomeContent(item);
              break;
            case 'about_page':
              setAboutContent(item);
              break;
            case 'contact_page':
              setContactContent(item);
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentSave = async (section: string, content: any) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({
          section,
          ...content
        }, { onConflict: 'section' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully"
      });

      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access the admin panel.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your website content and settings</p>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero Carousel</TabsTrigger>
            <TabsTrigger value="products">Product Carousel</TabsTrigger>
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
            <TabsTrigger value="contact">Contact Page</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Carousel Management</CardTitle>
              </CardHeader>
              <CardContent>
                <HeroCarouselEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Carousel Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductCarouselEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Home Page Content</CardTitle>
              </CardHeader>
              <CardContent>
                {homeContent ? (
                  <HomePageEditor 
                    content={homeContent}
                    onSave={(content) => handleContentSave('home_hero', content)}
                    onCancel={() => {}}
                  />
                ) : (
                  <p>Loading home content...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
              </CardHeader>
              <CardContent>
                {aboutContent ? (
                  <AboutPageEditor 
                    content={aboutContent}
                    onSave={(content) => handleContentSave('about_page', content)}
                    onCancel={() => {}}
                  />
                ) : (
                  <p>Loading about content...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Page Content</CardTitle>
              </CardHeader>
              <CardContent>
                {contactContent ? (
                  <ContactPageEditor 
                    content={contactContent}
                    onSave={(content) => handleContentSave('contact_page', content)}
                    onCancel={() => {}}
                  />
                ) : (
                  <p>Loading contact content...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
