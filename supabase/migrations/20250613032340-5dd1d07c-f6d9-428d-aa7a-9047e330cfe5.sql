
-- Insert homepage content sections that can be edited through admin panel
INSERT INTO public.website_content (section, title, description, image_url, content) VALUES 
('hero', 'Ancient Wisdom for Modern Wellness', 'Discover the healing power of authentic Ayurvedic medicines. Our time-tested formulations bring you natural solutions for lasting health and vitality.', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80', '{}'),
('featured_products', 'Featured Products', 'Discover our most popular Ayurvedic formulations, crafted with authentic ingredients and time-tested recipes.', NULL, '{
  "products": [
    {
      "id": 1,
      "name": "Triphala Churna",
      "description": "Ancient digestive formula for complete detoxification and bowel regularity.",
      "image": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
      "benefits": ["Improves digestion", "Natural detox", "Boosts immunity", "Enhances metabolism"],
      "category": "Digestive Health",
      "rating": 4.8,
      "reviews": 245
    },
    {
      "id": 2,
      "name": "Ashwagandha Capsules",
      "description": "Premium quality stress relief and energy enhancement supplement.",
      "image": "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80",
      "benefits": ["Reduces stress", "Improves energy", "Better sleep", "Mental clarity"],
      "category": "Wellness",
      "rating": 4.9,
      "reviews": 189
    },
    {
      "id": 3,
      "name": "Herbs Natural Hair Oil",
      "description": "Premium blend of natural herbs for healthy hair growth and reduced hair fall.",
      "image": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80",
      "benefits": ["Promotes hair growth", "Reduces hair fall", "Nourishes scalp", "Natural shine"],
      "category": "Hair Care",
      "rating": 4.8,
      "reviews": 156
    }
  ]
}'),
('testimonials', 'What Our Customers Say', 'Real experiences from people who chose natural healing', NULL, '{
  "testimonials": [
    {
      "name": "Priya Sharma",
      "text": "The Triphala has completely transformed my digestive health. Highly recommend!",
      "rating": 5
    },
    {
      "name": "Rajesh Kumar",
      "text": "Ashwagandha capsules helped me manage stress naturally. Excellent quality!",
      "rating": 5
    },
    {
      "name": "Meera Patel",
      "text": "The Hair Oil is amazing! My hair fall has reduced significantly.",
      "rating": 5
    }
  ]
}')
ON CONFLICT (section) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  content = EXCLUDED.content,
  updated_at = now();
