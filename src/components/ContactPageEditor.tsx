import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState } from 'react';

interface ContactPageEditorProps {
  content: any;
  onSave: (content: any) => void;
  onCancel: () => void;
}

const ContactPageEditor = ({ content, onSave, onCancel }: ContactPageEditorProps) => {
  const [editingContent, setEditingContent] = useState(content);

  const handleSave = () => {
    onSave(editingContent);
  };

  const renderContactInfoEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <Input
          value={editingContent.title || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            title: e.target.value
          })}
          placeholder="Contact Information"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={editingContent.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            description: e.target.value
          })}
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Phone Number</label>
        <Input
          value={editingContent.content?.phone?.number || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              phone: {
                ...editingContent.content?.phone,
                number: e.target.value
              }
            }
          })}
          placeholder="+91 8279277040"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Email</label>
        <Input
          value={editingContent.content?.email?.address || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              email: {
                ...editingContent.content?.email,
                address: e.target.value
              }
            }
          })}
          placeholder="info@balajiheathcare.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Address</label>
        <Textarea
          value={editingContent.content?.location?.address || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              location: {
                ...editingContent.content?.location,
                address: e.target.value
              }
            }
          })}
          rows={3}
        />
      </div>
    </div>
  );

  const renderFooterInfoEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Company Name</label>
        <Input
          value={editingContent.content?.company_name || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              company_name: e.target.value
            }
          })}
          placeholder="Balaji Healthcare"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Footer Description</label>
        <Textarea
          value={editingContent.content?.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              description: e.target.value
            }
          })}
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Phone</label>
        <Input
          value={editingContent.content?.phone || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              phone: e.target.value
            }
          })}
          placeholder="7999671829"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Email</label>
        <Input
          value={editingContent.content?.email || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            content: {
              ...editingContent.content,
              email: e.target.value
            }
          })}
          placeholder="info@balajiheathcare.com"
        />
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (editingContent.section) {
      case 'contact_info':
        return renderContactInfoEditor();
      case 'footer_info':
        return renderFooterInfoEditor();
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

export default ContactPageEditor;
