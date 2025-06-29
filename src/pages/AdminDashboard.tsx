import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl, getImageUrl } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Banner {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface Review {
  _id: string;
  image: string;
  text: string;
}

interface SiteInfo {
  _id: string;
  key: string;
  value: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  is_published: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({ image: '', title: '', subtitle: '' });
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({ image: '', text: '' });
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [reviewError, setReviewError] = useState('');
  const [siteInfo, setSiteInfo] = useState<SiteInfo[]>([]);
  const [loadingSiteInfo, setLoadingSiteInfo] = useState(true);
  const [showSiteInfoForm, setShowSiteInfoForm] = useState(false);
  const [editingSiteInfo, setEditingSiteInfo] = useState<SiteInfo | null>(null);
  const [siteInfoForm, setSiteInfoForm] = useState({ key: '', value: '' });
  const [siteInfoError, setSiteInfoError] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(true);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', image_url: '', author: '', is_published: true });
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogError, setBlogError] = useState('');
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    } else {
      fetchProducts();
      fetchBanners();
      fetchReviews();
      fetchSiteInfo();
      fetchBlogPosts();
      fetchContactMessages();
    }
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/products'));
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    setLoadingBanners(true);
    try {
      const res = await fetch(apiUrl('/api/banners'));
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      setBannerError('Failed to fetch banners');
    } finally {
      setLoadingBanners(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(apiUrl('/api/reviews'));
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setReviewError('Failed to fetch reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchSiteInfo = async () => {
    setLoadingSiteInfo(true);
    try {
      const res = await fetch(apiUrl('/api/site-info'));
      const data = await res.json();
      setSiteInfo(data);
    } catch (err) {
      setSiteInfoError('Failed to fetch site info');
    } finally {
      setLoadingSiteInfo(false);
    }
  };

  const fetchBlogPosts = async () => {
    setLoadingBlogPosts(true);
    try {
      const res = await fetch(apiUrl('/api/blog-posts'));
      const data = await res.json();
      setBlogPosts(data);
    } catch (err) {
      setBlogError('Failed to fetch blog posts');
    } finally {
      setLoadingBlogPosts(false);
    }
  };

  const fetchContactMessages = async () => {
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(apiUrl('/api/contact-messages'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch contact messages');
      const data = await res.json();
      setContactMessages(data);
    } catch (err) {
      setContactMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image;
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await fetch(apiUrl('/api/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    } as any);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Image upload failed');
    }
    const data = await res.json();
    return data.path;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const imagePath = await uploadImage();
      const token = localStorage.getItem('admin_token');
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? apiUrl(`/api/products/${editingProduct._id}`) : apiUrl('/api/products');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image: imagePath,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setForm({ name: '', description: '', price: '', image: '' });
      setImageFile(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    });
    setShowProductForm(true);
    setImageFile(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('Invalid product ID:', id);
      return;
    }
    if (!window.confirm('Delete this product?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(apiUrl(`/api/products/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchProducts();
  };

  const handleBannerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerForm({ ...bannerForm, [e.target.name]: e.target.value });
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImageFile(e.target.files[0]);
    }
  };

  const uploadBannerImage = async (): Promise<string> => {
    if (!bannerImageFile) return bannerForm.image;
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', bannerImageFile);
    const res = await fetch(apiUrl('/api/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    } as any);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Image upload failed');
    }
    const data = await res.json();
    return data.path;
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerError('');
    try {
      const imagePath = await uploadBannerImage();
      const token = localStorage.getItem('admin_token');
      const method = editingBanner ? 'PUT' : 'POST';
      const url = editingBanner ? apiUrl(`/api/banners/${editingBanner._id}`) : apiUrl('/api/banners');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: imagePath,
          title: bannerForm.title,
          subtitle: bannerForm.subtitle,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save banner');
      }
      setShowBannerForm(false);
      setEditingBanner(null);
      setBannerForm({ image: '', title: '', subtitle: '' });
      setBannerImageFile(null);
      fetchBanners();
    } catch (err: any) {
      setBannerError(err.message);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      image: banner.image,
      title: banner.title,
      subtitle: banner.subtitle,
    });
    setShowBannerForm(true);
    setBannerImageFile(null);
  };

  const handleDeleteBanner = async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('Invalid banner ID:', id);
      return;
    }
    if (!window.confirm('Delete this banner?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(apiUrl(`/api/banners/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchBanners();
  };

  const handleReviewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReviewImageFile(e.target.files[0]);
    }
  };

  const uploadReviewImage = async (): Promise<string> => {
    if (!reviewImageFile) return reviewForm.image;
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', reviewImageFile);
    const res = await fetch(apiUrl('/api/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    } as any);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Image upload failed');
    }
    const data = await res.json();
    return data.path;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    try {
      const imagePath = await uploadReviewImage();
      const token = localStorage.getItem('admin_token');
      const method = editingReview ? 'PUT' : 'POST';
      const url = editingReview ? apiUrl(`/api/reviews/${editingReview._id}`) : apiUrl('/api/reviews');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: imagePath,
          text: reviewForm.text,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save review');
      }
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ image: '', text: '' });
      setReviewImageFile(null);
      fetchReviews();
    } catch (err: any) {
      setReviewError(err.message);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      image: review.image,
      text: review.text,
    });
    setShowReviewForm(true);
    setReviewImageFile(null);
  };

  const handleDeleteReview = async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('Invalid review ID:', id);
      return;
    }
    if (!window.confirm('Delete this review?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(apiUrl(`/api/reviews/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchReviews();
  };

  const handleSiteInfoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSiteInfoForm({ ...siteInfoForm, [e.target.name]: e.target.value });
  };

  const handleSiteInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiteInfoError('');
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingSiteInfo ? 'PUT' : 'POST';
      const url = editingSiteInfo ? apiUrl(`/api/site-info/${editingSiteInfo._id}`) : apiUrl('/api/site-info');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: siteInfoForm.key,
          value: siteInfoForm.value,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save site info');
      }
      setShowSiteInfoForm(false);
      setEditingSiteInfo(null);
      setSiteInfoForm({ key: '', value: '' });
      fetchSiteInfo();
    } catch (err: any) {
      setSiteInfoError(err.message);
    }
  };

  const handleEditSiteInfo = (info: SiteInfo) => {
    setEditingSiteInfo(info);
    setSiteInfoForm({
      key: info.key,
      value: info.value,
    });
    setShowSiteInfoForm(true);
  };

  const handleDeleteSiteInfo = async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('Invalid site info ID:', id);
      return;
    }
    if (!window.confirm('Delete this site info entry?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(apiUrl(`/api/site-info/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchSiteInfo();
  };

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBlogImageFile(e.target.files[0]);
    }
  };

  const uploadBlogImage = async (): Promise<string> => {
    if (!blogImageFile) return blogForm.image_url;
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', blogImageFile);
    const res = await fetch(apiUrl('/api/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    } as any);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Image upload failed');
    }
    const data = await res.json();
    return data.path;
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogError('');
    try {
      const imagePath = await uploadBlogImage();
      const token = localStorage.getItem('admin_token');
      const method = editingBlogPost ? 'PUT' : 'POST';
      const url = editingBlogPost ? apiUrl(`/api/blog-posts/${editingBlogPost._id}`) : apiUrl('/api/blog-posts');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: blogForm.title,
          content: blogForm.content,
          excerpt: blogForm.excerpt,
          image_url: imagePath,
          author: blogForm.author,
          is_published: blogForm.is_published,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save blog post');
      }
      setShowBlogForm(false);
      setEditingBlogPost(null);
      setBlogForm({ title: '', content: '', excerpt: '', image_url: '', author: '', is_published: true });
      setBlogImageFile(null);
      fetchBlogPosts();
    } catch (err: any) {
      setBlogError(err.message);
    }
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image_url: post.image_url,
      author: post.author,
      is_published: post.is_published,
    });
    setShowBlogForm(true);
    setBlogImageFile(null);
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('Invalid blog post ID:', id);
      return;
    }
    if (!window.confirm('Delete this blog post?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(apiUrl(`/api/blog-posts/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchBlogPosts();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowProductForm(true);
                setEditingProduct(null);
                setForm({ name: '', description: '', price: '', image: '' });
                setImageFile(null);
              }}
            >
              Add Product
            </button>
            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="bg-white p-4 rounded shadow mb-4">
                {error && <div className="mb-2 text-red-600">{error}</div>}
                <div className="mb-2">
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border rounded px-3 py-2"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full border rounded px-3 py-2"
                    value={form.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full border rounded px-3 py-2"
                    value={form.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {form.image && !imageFile && (
                    <img src={form.image} alt="Product" className="h-16 mt-2" />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setForm({ name: '', description: '', price: '', image: '' });
                      setImageFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {loading ? (
              <div>Loading products...</div>
            ) : (
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="p-2">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="h-12" />
                        )}
                      </td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.description}</td>
                      <td className="p-2">₹{product.price}</td>
                      <td className="p-2">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Banners</h2>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowBannerForm(true);
                setEditingBanner(null);
                setBannerForm({ image: '', title: '', subtitle: '' });
                setBannerImageFile(null);
              }}
            >
              Add Banner
            </button>
            {showBannerForm && (
              <form onSubmit={handleBannerSubmit} className="bg-white p-4 rounded shadow mb-4">
                {bannerError && <div className="mb-2 text-red-600">{bannerError}</div>}
                <div className="mb-2">
                  <label className="block font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full border rounded px-3 py-2"
                    value={bannerForm.title}
                    onChange={handleBannerInputChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    className="w-full border rounded px-3 py-2"
                    value={bannerForm.subtitle}
                    onChange={handleBannerInputChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleBannerImageChange} />
                  {bannerForm.image && !bannerImageFile && (
                    <img src={getImageUrl(bannerForm.image)} alt="Banner" className="h-16 mt-2" />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editingBanner ? 'Update' : 'Add'} Banner
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setShowBannerForm(false);
                      setEditingBanner(null);
                      setBannerForm({ image: '', title: '', subtitle: '' });
                      setBannerImageFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {loadingBanners ? (
              <div>Loading banners...</div>
            ) : (
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Subtitle</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner._id}>
                      <td className="p-2">
                        {banner.image && (
                          <img src={getImageUrl(banner.image)} alt={banner.title} className="h-12" />
                        )}
                      </td>
                      <td className="p-2">{banner.title}</td>
                      <td className="p-2">{banner.subtitle}</td>
                      <td className="p-2">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                          onClick={() => handleEditBanner(banner)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDeleteBanner(banner._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowReviewForm(true);
                setEditingReview(null);
                setReviewForm({ image: '', text: '' });
                setReviewImageFile(null);
              }}
            >
              Add Review
            </button>
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded shadow mb-4">
                {reviewError && <div className="mb-2 text-red-600">{reviewError}</div>}
                <div className="mb-2">
                  <label className="block font-medium mb-1">Text</label>
                  <textarea
                    name="text"
                    className="w-full border rounded px-3 py-2"
                    value={reviewForm.text}
                    onChange={handleReviewInputChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleReviewImageChange} />
                  {reviewForm.image && !reviewImageFile && (
                    <img src={getImageUrl(reviewForm.image)} alt="Review" className="h-12" />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editingReview ? 'Update' : 'Add'} Review
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setShowReviewForm(false);
                      setEditingReview(null);
                      setReviewForm({ image: '', text: '' });
                      setReviewImageFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {loadingReviews ? (
              <div>Loading reviews...</div>
            ) : (
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Text</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td className="p-2">
                        {review.image && (
                          <img src={getImageUrl(review.image)} alt="Review" className="h-12" />
                        )}
                      </td>
                      <td className="p-2">{review.text}</td>
                      <td className="p-2">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                          onClick={() => handleEditReview(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowBlogForm(true);
                setEditingBlogPost(null);
                setBlogForm({ title: '', content: '', excerpt: '', image_url: '', author: '', is_published: true });
                setBlogImageFile(null);
              }}
            >
              Add Blog Post
            </button>
            {showBlogForm && (
              <form onSubmit={handleBlogSubmit} className="bg-white p-4 rounded shadow mb-4">
                {blogError && <div className="mb-2 text-red-600">{blogError}</div>}
                <div className="mb-2">
                  <label className="block font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full border rounded px-3 py-2"
                    value={blogForm.title}
                    onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Excerpt</label>
                  <input
                    type="text"
                    name="excerpt"
                    className="w-full border rounded px-3 py-2"
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Content</label>
                  <textarea
                    name="content"
                    className="w-full border rounded px-3 py-2"
                    value={blogForm.content}
                    onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleBlogImageChange} />
                  {blogForm.image_url && !blogImageFile && (
                    <img src={getImageUrl(blogForm.image_url)} alt="Blog" className="h-16 mt-2" />
                  )}
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    className="w-full border rounded px-3 py-2"
                    value={blogForm.author}
                    onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                  />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={blogForm.is_published}
                    onChange={e => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                    id="is_published"
                  />
                  <label htmlFor="is_published" className="font-medium">Published</label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editingBlogPost ? 'Update' : 'Add'} Blog Post
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setShowBlogForm(false);
                      setEditingBlogPost(null);
                      setBlogForm({ title: '', content: '', excerpt: '', image_url: '', author: '', is_published: true });
                      setBlogImageFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {loadingBlogPosts ? (
              <div>Loading blog posts...</div>
            ) : (
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Excerpt</th>
                    <th className="p-2 text-left">Author</th>
                    <th className="p-2 text-left">Published</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post._id}>
                      <td className="p-2">{post.image_url && <img src={getImageUrl(post.image_url)} alt={post.title} className="h-12" />}</td>
                      <td className="p-2">{post.title}</td>
                      <td className="p-2">{post.excerpt}</td>
                      <td className="p-2">{post.author}</td>
                      <td className="p-2">{post.is_published ? 'Yes' : 'No'}</td>
                      <td className="p-2">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                          onClick={() => handleEditBlogPost(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDeleteBlogPost(post._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Site Info</h2>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowSiteInfoForm(true);
                setEditingSiteInfo(null);
                setSiteInfoForm({ key: '', value: '' });
              }}
            >
              Add Site Info
            </button>
            {showSiteInfoForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded shadow p-6">
                  <h2 className="text-xl font-semibold mb-2">Site Info</h2>
                  <p>Manage your site info here. (Coming soon)</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
            {loadingMessages ? (
              <div>Loading messages...</div>
            ) : contactMessages.length === 0 ? (
              <div>No contact messages found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Phone</th>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-left">Message</th>
                      <th className="p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.map((msg) => (
                      <tr key={msg.id}>
                        <td className="p-2">{msg.first_name} {msg.last_name}</td>
                        <td className="p-2">{msg.phone}</td>
                        <td className="p-2">{msg.subject}</td>
                        <td className="p-2">{msg.message}</td>
                        <td className="p-2">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 