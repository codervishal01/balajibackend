
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();
    
    setPost(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article>
          <header className="mb-8">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              />
            )}
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
