import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .eq('section', 'footer_info')
      .single();

    if (data?.content) {
      setFooterData(data.content);
    }
  };

  // Default fallback data
  const defaultData = {
    company_name: "Balaji Healthcare",
    description: "Bringing you authentic Ayurvedic medicines and holistic wellness solutions for a healthier, more balanced life.",
    phone: "8279277040",
    email: "info@balajiheathcare.com",
    address: "123 Wellness Street\nBalaji City, India"
  };

  const data = footerData || defaultData;
  const phoneNumber = data.phone;

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Balaji Healthcare Logo" 
                className="h-6 w-6"
              />
              <span className="font-heading text-lg font-bold">{data.company_name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.description}
            </p>
            <div className="flex space-x-3">
              <Button size="sm" className="gradient-bg text-white" asChild>
                <a href={`tel:${phoneNumber}`} className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Products</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Digestive Health</span></li>
              <li><span className="text-muted-foreground">Immunity Boosters</span></li>
              <li><span className="text-muted-foreground">Respiratory Care</span></li>
              <li><span className="text-muted-foreground">Skin & Hair Care</span></li>
              <li><span className="text-muted-foreground">Joint & Muscle Care</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href={`tel:${phoneNumber}`} className="text-muted-foreground hover:text-primary transition-colors">
                    +91 {phoneNumber}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${data.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {data.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {data.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 {data.company_name}. All rights reserved. | Made with ❤️ for natural healing</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
