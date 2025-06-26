import { useState, useEffect } from 'react';
import ContactFormHandler from '@/components/ContactFormHandler';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .eq('section', 'contact_info')
      .single();

    if (data?.content) {
      setContactInfo(data.content);
    }
  };

  // Default fallback data
  const defaultContactInfo = {
    location: {
      title: "Our Location",
      address: "123 Wellness Street\nHealth City, HC 12345\nIndia"
    },
    phone: {
      title: "Phone",
      number: "+91 8279277040",
      availability: "Available 9 AM - 6 PM IST"
    },
    email: {
      title: "Email",
      address: "info@balajiheathcare.com",
      response_time: "We'll respond within 24 hours"
    },
    hours: {
      title: "Business Hours",
      schedule: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
        "Sunday: Closed"
      ]
    }
  };

  const info = contactInfo || defaultContactInfo;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our Ayurvedic products or need personalized health guidance? 
            Our experts are here to help you on your wellness journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{info.location.title}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {info.location.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{info.phone.title}</h3>
                  <p className="text-muted-foreground">{info.phone.number}</p>
                  <p className="text-sm text-muted-foreground">{info.phone.availability}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{info.email.title}</h3>
                  <p className="text-muted-foreground">{info.email.address}</p>
                  <p className="text-sm text-muted-foreground">{info.email.response_time}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{info.hours.title}</h3>
                  <div className="text-muted-foreground space-y-1">
                    {info.hours.schedule.map((time: string, index: number) => (
                      <p key={index}>{time}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-secondary/20 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Why Choose Our Ayurvedic Approach?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Personalized consultations based on your unique constitution</li>
                <li>• Authentic Ayurvedic formulations with proven ingredients</li>
                <li>• Holistic approach to health and wellness</li>
                <li>• Expert guidance from certified Ayurvedic practitioners</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
              Send us a Message
            </h2>
            <ContactFormHandler />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
