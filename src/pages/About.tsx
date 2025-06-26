import { useState, useEffect } from 'react';
import { Heart, Shield, Award, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
  const [aboutContent, setAboutContent] = useState<any>({});

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .in('section', ['about_hero', 'about_journey', 'about_stats', 'about_team']);

    if (data) {
      const contentMap = data.reduce((acc, item) => {
        acc[item.section] = item;
        return acc;
      }, {});
      setAboutContent(contentMap);
    }
  };

  const values = [
    {
      icon: <img src="/logo.png" alt="Natural & Pure" className="h-8 w-8" />,
      title: "Natural & Pure",
      description: "We source only the finest organic herbs and ingredients, ensuring purity and potency in every product."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Holistic Approach",
      description: "Our treatments address the root cause, promoting overall wellness of mind, body, and spirit."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Safe & Effective",
      description: "All our formulations are prepared following traditional methods with modern quality standards."
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Authentic Recipes",
      description: "Time-tested formulations passed down through generations of Ayurvedic practitioners."
    }
  ];

  const heroContent = aboutContent.about_hero || {
    title: 'About Balaji Healthcare',
    description: 'Bridging ancient Ayurvedic wisdom with modern wellness needs for over 15 years, helping thousands find natural healing and balance.'
  };

  const journeyContent = aboutContent.about_journey || {
    title: 'Our Journey of Healing',
    description: 'Founded in 2009, Balaji Healthcare began as a small clinic with a big vision.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    content: {
      paragraphs: [
        'Founded in 2009, Balaji Healthcare began as a small clinic with a big vision: to make authentic Ayurvedic medicine accessible to everyone seeking natural healing solutions.',
        'Our founder, Dr. Priya Sharma, comes from a family of traditional Ayurvedic practitioners spanning five generations. Combining this hereditary knowledge with modern research, we have developed products that honor ancient wisdom while meeting contemporary quality standards.',
        'Today, we are proud to serve over 1000 customers worldwide, offering personalized consultations and carefully crafted herbal formulations that promote holistic wellness.'
      ]
    }
  };

  const statsContent = aboutContent.about_stats || {
    title: 'Our Impact in Numbers',
    description: 'Measurable results in our journey of natural healing',
    content: {
      stats: [
        { number: "1000+", label: "Happy Customers" },
        { number: "50+", label: "Ayurvedic Products" },
        { number: "15+", label: "Years Experience" },
        { number: "100%", label: "Natural Ingredients" }
      ]
    }
  };

  const teamContent = aboutContent.about_team || {
    title: 'Meet Our Experts',
    description: 'Our team of experienced Ayurvedic practitioners dedicated to your wellness journey.',
    content: {
      team: [
        {
          name: "Dr. Priya Sharma",
          role: "Chief Ayurvedic Practitioner",
          experience: "20+ years",
          specialization: "Digestive Health & Detox",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
        },
        {
          name: "Dr. Rajesh Kumar",
          role: "Senior Consultant",
          experience: "15+ years",
          specialization: "Stress Management & Mental Wellness",
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80"
        },
        {
          name: "Dr. Meera Patel",
          role: "Wellness Specialist",
          experience: "12+ years",
          specialization: "Women Health & Immunity",
          image: "https://images.unsplash.com/photo-1594824227252-2eb7b25d3605?auto=format&fit=crop&w=300&q=80"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {heroContent.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {heroContent.description}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                {journeyContent.title}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {journeyContent.content?.paragraphs?.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={journeyContent.image_url}
                alt="Ayurvedic herbs and traditional preparation"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">15+ Years</p>
                    <p className="text-sm text-muted-foreground">Serving with trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              {statsContent.title}
            </h2>
            <p className="text-muted-foreground">
              {statsContent.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsContent.content?.stats?.map((stat: any, index: number) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do in our mission to promote natural wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {teamContent.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {teamContent.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamContent.content?.team?.map((member: any, index: number) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.experience}</p>
                    <p className="text-sm text-muted-foreground">{member.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            "To preserve and share the timeless wisdom of Ayurveda, making authentic natural healing 
            accessible to everyone. We believe in empowering individuals to take charge of their health 
            through personalized, holistic approaches that honor the body's innate ability to heal."
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="tel:8279277040" className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Join Our Wellness Community</span>
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
