
-- Create a table for website content management
CREATE TABLE public.website_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(100) NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  image_url TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for products that can be managed
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  benefits TEXT[],
  category TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for blog posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'Admin',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default website content
INSERT INTO public.website_content (section, title, description, content) VALUES
('hero', 'Welcome to AyurVeda Wellness', 'Ancient wisdom for modern healing. Discover authentic Ayurvedic medicines and wellness solutions.', '{"subtitle": "Transform your health naturally", "cta_text": "Explore Products"}'),
('about', 'About Us', 'We are dedicated to bringing you the finest Ayurvedic medicines and wellness products.', '{"mission": "To promote natural healing through authentic Ayurvedic practices", "vision": "A healthier world through ancient wisdom"}'),
('contact', 'Contact Information', 'Get in touch with our experts', '{"phone": "7999671829", "email": "info@ayurvedawellness.com", "address": "123 Wellness Street, Health City"}');

-- Insert sample products
INSERT INTO public.products (name, description, image_url, benefits, category, rating, reviews) VALUES
('Triphala Churna', 'Ancient digestive formula for complete detoxification and bowel regularity.', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80', ARRAY['Improves digestion', 'Natural detox', 'Boosts immunity', 'Enhances metabolism'], 'Digestive Health', 4.8, 245),
('Ashwagandha Capsules', 'Premium quality stress relief and energy enhancement supplement.', 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80', ARRAY['Reduces stress', 'Improves energy', 'Better sleep', 'Mental clarity'], 'Wellness', 4.9, 189),
('Turmeric Gold', 'Pure curcumin extract with enhanced bioavailability for maximum benefits.', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&q=80', ARRAY['Anti-inflammatory', 'Joint health', 'Immunity boost', 'Natural healing'], 'Joint Care', 4.7, 156);

-- Enable Row Level Security
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Website content is publicly readable" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Active products are publicly readable" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Published blog posts are publicly readable" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Create policies for admin access
CREATE POLICY "Admins can manage website content" ON public.website_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
