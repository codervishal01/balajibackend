
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface HomePageEditorProps {
  content: any;
  onSave: (content: any) => void;
  onCancel: () => void;
}

const HomePageEditor = ({ content, onSave, onCancel }: HomePageEditorProps) => {
  const [editingContent, setEditingContent] = useState(content);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editingContent);
  };

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={editingContent.title || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            title: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={editingContent.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            description: e.target.value
          })}
          rows={3}
        />
      </div>
      <ImageUpload
        label="Hero Image"
        value={editingContent.image_url || ''}
        onChange={(url) => setEditingContent({
          ...editingContent,
          image_url: url
        })}
      />
    </div>
  );

  const renderFeaturedProductsEditor = () => {
    const products = editingContent.content?.products || [];

    const addProduct = () => {
      const newProduct = {
        id: Date.now(),
        name: '',
        description: '',
        image: '',
        benefits: [],
        category: '',
        rating: 4.5,
        reviews: 0
      };
      
      setEditingContent({
        ...editingContent,
        content: {
          ...editingContent.content,
          products: [...products, newProduct]
        }
      });
    };

    const updateProduct = (index: number, field: string, value: any) => {
      const updatedProducts = [...products];
      if (field === 'benefits') {
        updatedProducts[index][field] = typeof value === 'string' 
          ? value.split(',').map((b: string) => b.trim()).filter(Boolean)
          : value;
      } else {
        updatedProducts[index][field] = value;
      }
      
      setEditingContent({
        ...editingContent,
        content: {
          ...editingContent.content,
          products: updatedProducts
        }
      });
    };

    const removeProduct = (index: number) => {
      const updatedProducts = products.filter((_: any, i: number) => i !== index);
      setEditingContent({
        ...editingContent,
        content: {
          ...editingContent.content,
          products: updatedProducts
        }
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Section Title</label>
          <Input
            value={editingContent.title || ''}
            onChange={(e) => setEditingContent({
              ...editingContent,
              title: e.target.value
            })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Section Description</label>
          <Textarea
            value={editingContent.description || ''}
            onChange={(e) => setEditingContent({
              ...editingContent,
              description: e.target.value
            })}
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Featured Products</h4>
            <Button size="sm" onClick={addProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {products.map((product: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h5 className="font-medium">Product {index + 1}</h5>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProduct(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={product.name || ''}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={product.category || ''}
                    onChange={(e) => updateProduct(index, 'category', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={product.description || ''}
                  onChange={(e) => updateProduct(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="mt-4">
                <ImageUpload
                  label="Product Image"
                  value={product.image || ''}
                  onChange={(url) => updateProduct(index, 'image', url)}
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Benefits (comma-separated)</label>
                <Input
                  value={Array.isArray(product.benefits) ? product.benefits.join(', ') : ''}
                  onChange={(e) => updateProduct(index, 'benefits', e.target.value)}
                />
                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.benefits.map((benefit: string, i: number) => (
                      <Badge key={i} variant="outline">{benefit}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={product.rating || 4.5}
                    onChange={(e) => updateProduct(index, 'rating', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reviews</label>
                  <Input
                    type="number"
                    min="0"
                    value={product.reviews || 0}
                    onChange={(e) => updateProduct(index, 'reviews', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderTestimonialsEditor = () => {
    const testimonials = editingContent.content?.testimonials || [];

    const addTestimonial = () => {
      const newTestimonial = {
        name: '',
        text: '',
        rating: 5
      };
      
      setEditingContent({
        ...editingContent,
        content: {
          ...editingContent.content,
          testimonials: [...testimonials, newTestimonial]
        }
      });
    };

    const updateTestimonial = (index: number, field: string, value: any) => {
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[index][field] = value;
      
      setEditingContent({
        ...editingContent,
        content: {
          ...editingContent.content,
          testimonials: updatedTestimonials
        }
      });
    };

    const removeTestimonial = (index: number) => {
      const updatedTestimonials = testimonials.filter((_: any, i: number) => i !== index);
      setEditingContent({
        ...editingContent,
        content: {
          ...editingContent.content,
          testimonials: updatedTestimonials
        }
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Section Title</label>
          <Input
            value={editingContent.title || ''}
            onChange={(e) => setEditingContent({
              ...editingContent,
              title: e.target.value
            })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Section Description</label>
          <Textarea
            value={editingContent.description || ''}
            onChange={(e) => setEditingContent({
              ...editingContent,
              description: e.target.value
            })}
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Customer Testimonials</h4>
            <Button size="sm" onClick={addTestimonial}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>

          {testimonials.map((testimonial: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h5 className="font-medium">Testimonial {index + 1}</h5>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input
                    value={testimonial.name || ''}
                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating || 5}
                    onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Testimonial Text</label>
                <Textarea
                  value={testimonial.text || ''}
                  onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                  rows={3}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    switch (editingContent.section) {
      case 'hero':
        return renderHeroEditor();
      case 'featured_products':
        return renderFeaturedProductsEditor();
      case 'testimonials':
        return renderTestimonialsEditor();
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {editingContent.section?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderEditor()}
        
        <div className="flex space-x-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePageEditor;
