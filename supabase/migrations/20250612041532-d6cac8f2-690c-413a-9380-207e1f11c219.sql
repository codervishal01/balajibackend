
-- Add the new hair oil product
INSERT INTO public.products (name, description, image_url, benefits, category, rating, reviews, is_active)
VALUES (
  'Herbs Natural Hair Oil',
  'A premium blend of natural herbs designed to nourish your hair from root to tip. This traditional Ayurvedic formulation promotes hair growth, reduces hair fall, and adds natural shine to your hair.',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
  ARRAY[
    'Promotes natural hair growth',
    'Reduces hair fall and breakage',
    'Nourishes scalp and hair follicles',
    'Adds natural shine and softness',
    'Strengthens hair from roots',
    'Made with 100% natural herbs',
    'Suitable for all hair types',
    'Chemical-free formulation'
  ],
  'Hair Care',
  4.8,
  156,
  true
);

-- Add a blog post about the hair oil
INSERT INTO public.blog_posts (title, excerpt, content, image_url, author, is_published)
VALUES (
  'The Power of Herbs Natural Hair Oil: Ancient Wisdom for Modern Hair Care',
  'Discover how our traditional Ayurvedic hair oil blend can transform your hair health naturally, promoting growth and preventing hair fall with time-tested herbal ingredients.',
  'Hair has always been considered a symbol of beauty and vitality in Indian culture. Our ancestors understood the importance of natural hair care, using herbs and oils that have been trusted for centuries. Today, we bring you the same traditional wisdom in our Herbs Natural Hair Oil.

## The Science Behind Natural Hair Care

Modern lifestyle, pollution, stress, and chemical treatments can severely damage our hair. Hair fall, premature graying, dandruff, and dull hair are common problems faced by people today. While the market is flooded with chemical-based solutions, Ayurveda offers a safer, more effective approach.

## Key Ingredients in Our Hair Oil

Our Herbs Natural Hair Oil is a carefully crafted blend of:

### Amla (Indian Gooseberry)
Rich in Vitamin C and antioxidants, amla strengthens hair follicles and promotes healthy hair growth. It also helps prevent premature graying and adds natural shine.

### Bhringraj (False Daisy)
Known as the "king of herbs" for hair, bhringraj is renowned for its ability to prevent hair fall and promote new hair growth. It also helps in treating scalp infections.

### Coconut Oil Base
Our oil uses pure coconut oil as the base, which penetrates deep into the hair shaft, providing essential nutrients and moisture.

### Neem
With its antifungal and antibacterial properties, neem helps maintain a healthy scalp and prevents dandruff.

## How to Use Herbs Natural Hair Oil

For best results, apply the oil to your scalp and hair 2-3 times a week. Gently massage in circular motions and leave for at least 2 hours before washing. For intensive treatment, you can leave it overnight.

## The Balaji Healthcare Promise

At Balaji Healthcare, we believe in the power of nature. Our products are made with 100% natural ingredients, following traditional Ayurvedic principles while meeting modern quality standards.

Experience the transformation that thousands of our customers have enjoyed. Your journey to healthier, stronger hair starts with our Herbs Natural Hair Oil.',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
  'Dr. Balaji Healthcare Team',
  true
);
