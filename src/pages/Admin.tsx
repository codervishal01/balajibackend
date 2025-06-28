import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCarouselEditor from '@/components/ProductCarouselEditor';
import HeroCarouselEditor from '@/components/HeroCarouselEditor';
import HomePageEditor from '@/components/HomePageEditor';
import AboutPageEditor from '@/components/AboutPageEditor';
import ContactPageEditor from '@/components/ContactPageEditor';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';

const Admin = () => {
  const { toast } = useToast();
  const [homeContent, setHomeContent] = useState<any>(null);
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [contactContent, setContactContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(apiUrl('/api/site-info'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch site info');
      const data = await res.json();
      data.forEach((item: any) => {
        switch (item.key) {
          case 'home_hero':
            setHomeContent(item);
            break;
          case 'about_page':
            setAboutContent(item);
            break;
          case 'contact_page':
            setContactContent(item);
            break;
        }
      });
    } catch (err: any) {
      setError(err.message || 'Error fetching site info');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSave = async (key: string, content: any) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(apiUrl(`/api/site-info/${key}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to save content');
    } catch (err: any) {
      setError(err.message || 'Error saving content');
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Rest of the component content */}
    </div>
  );
};

export default Admin;