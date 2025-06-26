import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    setBlogPosts(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading blog posts...</div>
      </div>
    );
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Wellness Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover ancient wisdom for modern living. Explore our collection of articles on Ayurveda, 
            natural healing, and holistic wellness.
          </p>
        </div>
      </section>

      {featuredPost && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Featured Article</h2>
              <p className="text-muted-foreground">Our latest insights on Ayurvedic wellness</p>
            </div>
            
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-12">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  {featuredPost.image_url && (
                    <img
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                      {featuredPost.title}
                    </h3>
                    {featuredPost.excerpt && (
                      <p className="text-muted-foreground text-lg">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button className="gradient-bg text-white hover:scale-105 transition-transform duration-200 w-fit" asChild>
                      <Link to={`/blog/${featuredPost.id}`}>
                        Read Full Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {otherPosts.length > 0 && (
        <section className="py-12 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">All Articles</h2>
              <p className="text-muted-foreground">Explore our complete collection of wellness content</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden">
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button size="sm" variant="ghost" className="hover:text-primary" asChild>
                        <Link to={`/blog/${post.id}`}>
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {blogPosts.length === 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-heading font-bold mb-4">No Blog Posts Yet</h2>
            <p className="text-muted-foreground">Check back soon for wellness tips and Ayurvedic insights!</p>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Stay Updated with Wellness Tips
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest articles on Ayurveda, natural healing, and wellness directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" variant="secondary" asChild>
              <a href="tel:8279277040">Call for Wellness Consultation</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
