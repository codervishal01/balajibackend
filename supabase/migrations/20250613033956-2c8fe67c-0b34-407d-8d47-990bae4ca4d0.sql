
-- Insert About page editable sections
INSERT INTO public.website_content (section, title, description, image_url, content) VALUES 
('about_hero', 'About Balaji Healthcare', 'Bridging ancient Ayurvedic wisdom with modern wellness needs for over 15 years, helping thousands find natural healing and balance.', NULL, '{}'),
('about_journey', 'Our Journey of Healing', 'Founded in 2009, Balaji Healthcare began as a small clinic with a big vision: to make authentic Ayurvedic medicine accessible to everyone seeking natural healing solutions.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', '{
  "paragraphs": [
    "Founded in 2009, Balaji Healthcare began as a small clinic with a big vision: to make authentic Ayurvedic medicine accessible to everyone seeking natural healing solutions.",
    "Our founder, Dr. Priya Sharma, comes from a family of traditional Ayurvedic practitioners spanning five generations. Combining this hereditary knowledge with modern research, we have developed products that honor ancient wisdom while meeting contemporary quality standards.",
    "Today, we are proud to serve over 1000 customers worldwide, offering personalized consultations and carefully crafted herbal formulations that promote holistic wellness."
  ]
}'),
('about_stats', 'Our Impact in Numbers', 'Measurable results in our journey of natural healing', NULL, '{
  "stats": [
    {"number": "1000+", "label": "Happy Customers"},
    {"number": "50+", "label": "Ayurvedic Products"},
    {"number": "15+", "label": "Years Experience"},
    {"number": "100%", "label": "Natural Ingredients"}
  ]
}'),
('about_team', 'Meet Our Experts', 'Our team of experienced Ayurvedic practitioners dedicated to your wellness journey.', NULL, '{
  "team": [
    {
      "name": "Dr. Priya Sharma",
      "role": "Chief Ayurvedic Practitioner",
      "experience": "20+ years",
      "specialization": "Digestive Health & Detox",
      "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
    },
    {
      "name": "Dr. Rajesh Kumar",
      "role": "Senior Consultant",
      "experience": "15+ years",
      "specialization": "Stress Management & Mental Wellness",
      "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80"
    },
    {
      "name": "Dr. Meera Patel",
      "role": "Wellness Specialist",
      "experience": "12+ years",
      "specialization": "Women Health & Immunity",
      "image": "https://images.unsplash.com/photo-1594824227252-2eb7b25d3605?auto=format&fit=crop&w=300&q=80"
    }
  ]
}'),
('contact_info', 'Contact Information', 'Have questions about our Ayurvedic products or need personalized health guidance? Our experts are here to help you on your wellness journey.', NULL, '{
  "location": {
    "title": "Our Location",
    "address": "123 Wellness Street\\nHealth City, HC 12345\\nIndia"
  },
  "phone": {
    "title": "Phone",
    "number": "+91 7999671829",
    "availability": "Available 9 AM - 6 PM IST"
  },
  "email": {
    "title": "Email",
    "address": "info@balajiheathcare.com",
    "response_time": "We will respond within 24 hours"
  },
  "hours": {
    "title": "Business Hours",
    "schedule": [
      "Monday - Friday: 9:00 AM - 6:00 PM",
      "Saturday: 10:00 AM - 4:00 PM",
      "Sunday: Closed"
    ]
  }
}'),
('footer_info', 'Footer Contact Information', 'Contact details displayed in the footer', NULL, '{
  "company_name": "Balaji Healthcare",
  "description": "Bringing you authentic Ayurvedic medicines and holistic wellness solutions for a healthier, more balanced life.",
  "phone": "7999671829",
  "email": "info@balajiheathcare.com",
  "address": "123 Wellness Street\\nBalaji City, India"
}')
ON CONFLICT (section) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  content = EXCLUDED.content,
  updated_at = now();
