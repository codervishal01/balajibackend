// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/balaji_healthcare';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyjuf936l',
  api_key: process.env.CLOUDINARY_API_KEY || '324417667382339',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZPlEBNUSwwkQZ4YaZAYfWJPtcl4'
});

// Alternative: Use CLOUDINARY_URL if provided
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: 'dyjuf936l',
    api_key: '324417667382339',
    api_secret: 'ZPlEBNUSwwkQZ4YaZAYfWJPtcl4'
  });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Add robust MongoDB connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Periodic ping to keep MongoDB connection alive (every 5 minutes)
setInterval(async () => {
  try {
    await mongoose.connection.db.admin().ping();
    // console.log('MongoDB ping successful'); // Uncomment for debug
  } catch (err) {
    console.error('MongoDB ping failed:', err);
  }
}, 5 * 60 * 1000); // 5 minutes

// MongoDB Models
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  image: String,
  category: String,
  benefits: [String],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: String,
  subtitle: String,
  cta: String,
  ctaLink: String
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  image: String,
  text: String,
  name: String,
  rating: { type: Number, default: 5 }
}, { timestamps: true });

const siteInfoSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: String
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  excerpt: String,
  image_url: String,
  author: { type: String, default: 'Admin' },
  is_published: { type: Boolean, default: true }
}, { timestamps: true });

const contactMessageSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);
const Review = mongoose.model('Review', reviewSchema);
const SiteInfo = mongoose.model('SiteInfo', siteInfoSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Initialize default data
async function initializeData() {
  try {
    // Create default admin users
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('Default admin user created: admin / admin123');
    }

    const shubhamExists = await Admin.findOne({ username: 'shubham' });
    if (!shubhamExists) {
      const hashedPassword = bcrypt.hashSync('shubham@123', 10);
      await Admin.create({ username: 'shubham', password: hashedPassword });
      console.log('Admin user created: shubham / shubham@123');
    }

    // Create demo blog post
    const blogExists = await BlogPost.findOne();
    if (!blogExists) {
      await BlogPost.create({
        title: 'Welcome to the Blog!',
        content: 'This is your first blog post. Edit or add more posts from the database.',
        excerpt: 'A short excerpt for the first post.',
        image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80',
        author: 'Admin',
        is_published: true
      });
      console.log('Demo blog post created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Initialize data after connection
mongoose.connection.once('open', () => {
  initializeData();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'MongoDB Atlas' });
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Cloudinary storage configuration
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'balaji-healthcare',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

// Multer setup with Cloudinary
const upload = multer({ storage: cloudinaryStorage });

// Image upload endpoint (admin only) - Cloudinary
app.post('/api/upload', authenticateToken, (req, res) => {
  console.log('Upload endpoint hit');
  
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message || 'Image upload failed' });
    }
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File uploaded to Cloudinary:', req.file.filename);
    console.log('Cloudinary URL:', req.file.path);
    res.json({ path: req.file.path });
  });
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// PRODUCTS CRUD
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// BANNERS CRUD
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/banners', authenticateToken, async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

app.put('/api/banners/:id', authenticateToken, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

app.delete('/api/banners/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// REVIEWS CRUD
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

app.put('/api/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid review ID' });
    }
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// SITE INFO CRUD
app.get('/api/site-info', async (req, res) => {
  try {
    const siteInfo = await SiteInfo.find();
    res.json(siteInfo);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/site-info', authenticateToken, async (req, res) => {
  try {
    const siteInfo = new SiteInfo(req.body);
    await siteInfo.save();
    res.status(201).json(siteInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site info' });
  }
});

app.put('/api/site-info/:key', authenticateToken, async (req, res) => {
  try {
    const siteInfo = await SiteInfo.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true, upsert: true }
    );
    res.json(siteInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site info' });
  }
});

app.delete('/api/site-info/:key', authenticateToken, async (req, res) => {
  try {
    const key = req.params.key;
    if (!key || key === 'undefined') {
      return res.status(400).json({ error: 'Invalid site info key' });
    }
    const siteInfo = await SiteInfo.findOneAndDelete({ key });
    if (!siteInfo) return res.status(404).json({ error: 'Site info not found' });
    res.json({ message: 'Site info deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site info' });
  }
});

// BLOG POSTS CRUD
app.get('/api/blog-posts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ is_published: true }).sort({ createdAt: -1 });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/blog-posts', authenticateToken, async (req, res) => {
  try {
    const blogPost = new BlogPost(req.body);
    await blogPost.save();
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.put('/api/blog-posts/:id', authenticateToken, async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blogPost) return res.status(404).json({ error: 'Blog post not found' });
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

app.delete('/api/blog-posts/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid blog post ID' });
    }
    const blogPost = await BlogPost.findByIdAndDelete(id);
    if (!blogPost) return res.status(404).json({ error: 'Blog post not found' });
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// CONTACT MESSAGES
app.get('/api/contact-messages', authenticateToken, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${MONGO_URI}`);
}); 