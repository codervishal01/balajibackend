import { useState, useEffect } from 'react';
import ContactFormHandler from '@/components/ContactFormHandler';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { apiUrl } from '@/lib/api';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await fetch(apiUrl('/api/site-info'));
      const data = await res.json();
      const contactEntry = data.find((entry: any) => entry.key === 'contact_info');
      setContactInfo(contactEntry ? JSON.parse(contactEntry.value) : null);
    } catch (error) {
      setContactInfo(null);
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
        <div className="flex justify-center">
          <div className="bg-card p-8 rounded-lg border w-full max-w-xl">
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
              Send us a Message
            </h2>
            <ContactFormHandler />
          </div>
        </div>
      </div>
      {/* Contact Image Banner at the bottom, in place of footer */}
      <div className="w-full flex justify-center mt-12">
        <img
          src="/contactimg.jpg"
          alt="Contact Balaji HealthCare"
          className="w-full max-h-96 object-cover rounded-2xl shadow-xl"
          style={{ maxWidth: '900px' }}
        />
      </div>
    </div>
  );
};

export default Contact;
