
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload = ({ value, onChange, label = "Image", className }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    // Create a FileReader to convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
      setUploading(false);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!"
      });
    };
    
    reader.onerror = () => {
      setUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      
      <div className="space-y-4 mt-2">
        {/* File Upload */}
        <div>
          <Label htmlFor="file-upload" className="text-xs text-muted-foreground">
            Upload from computer
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? 'Uploading...' : 'Choose'}
            </Button>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor="image-url" className="text-xs text-muted-foreground">
            Or paste image URL
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              id="image-url"
              type="url"
              value={value || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="border rounded-lg p-2">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 w-auto rounded object-cover"
              onError={() => {
                toast({
                  title: "Error",
                  description: "Failed to load image preview",
                  variant: "destructive"
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
