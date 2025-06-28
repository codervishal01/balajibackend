// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://balaji-backend-cdxs.onrender.com';

export const apiUrl = (endpoint: string) => {
  // If endpoint already starts with http, return as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Return full URL
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper to get the correct image URL
export const getImageUrl = (img?: string) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  // Remove leading slash if present
  const cleanImg = img.startsWith('/') ? img.slice(1) : img;
  return `${API_BASE_URL}/${cleanImg}`;
};

export default apiUrl; 