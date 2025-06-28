import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { apiUrl } from '@/lib/api';

const ContactFormHandler = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    problem: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const problemOptions = [
    'Digestive Issues',
    'Hair Fall/Hair Problems',
    'Skin Problems',
    'Joint Pain',
    'Stress & Anxiety',
    'Immunity Issues',
    'Weight Management',
    'Sleep Disorders',
    'General Health Consultation',
    'Product Information',
    'Other Health Concerns'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          subject: formData.problem,
          message: formData.message || 'No message provided'
        })
      });
      if (!res.ok) throw new Error('Failed to send message');
      toast({
        title: 'Message Sent!',
        description: "We'll get back to you within 24 hours."
      });
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        problem: '',
        message: ''
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProblemSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      problem: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="problem">Problem Type</Label>
        <Select value={formData.problem} onValueChange={handleProblemSelect} required>
          <SelectTrigger>
            <SelectValue placeholder="Select your health concern" />
          </SelectTrigger>
          <SelectContent>
            {problemOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea 
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your health concerns, questions about products, or how we can help you..."
          rows={5}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full gradient-bg text-white hover:scale-105 transition-transform duration-200"
        disabled={loading}
      >
        <Send className="h-4 w-4 mr-2" />
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Your information will never be shared with third parties.
      </p>
    </form>
  );
};

export default ContactFormHandler;
