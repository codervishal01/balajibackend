require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyjuf936l',
  api_key: process.env.CLOUDINARY_API_KEY || '324417667382339',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZPlEBNUSwwkQZ4YaZAYfWJPtcl4'
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/balaji_healthcare';

// MongoDB Models
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

const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);
const Review = mongoose.model('Review', reviewSchema);

async function uploadToCloudinary(filePath, folder = 'balaji-healthcare') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      transformation: [{ width: 800, height: 600, crop: 'limit' }]
    });
    console.log(`Uploaded ${filePath} to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

async function migrateImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);

    console.log(`Found ${files.length} files to migrate`);

    // Migrate Products
    const products = await Product.find();
    for (const product of products) {
      if (product.image && product.image.startsWith('/uploads/')) {
        const fileName = product.image.replace('/uploads/', '');
        const filePath = path.join(uploadsDir, fileName);
        
        if (fs.existsSync(filePath)) {
          const cloudinaryUrl = await uploadToCloudinary(filePath, 'balaji-healthcare/products');
          if (cloudinaryUrl) {
            await Product.findByIdAndUpdate(product._id, { image: cloudinaryUrl });
            console.log(`Updated product ${product.name} with Cloudinary URL`);
          }
        }
      }
    }

    // Migrate Banners
    const banners = await Banner.find();
    for (const banner of banners) {
      if (banner.image && banner.image.startsWith('/uploads/')) {
        const fileName = banner.image.replace('/uploads/', '');
        const filePath = path.join(uploadsDir, fileName);
        
        if (fs.existsSync(filePath)) {
          const cloudinaryUrl = await uploadToCloudinary(filePath, 'balaji-healthcare/banners');
          if (cloudinaryUrl) {
            await Banner.findByIdAndUpdate(banner._id, { image: cloudinaryUrl });
            console.log(`Updated banner with Cloudinary URL`);
          }
        }
      }
    }

    // Migrate Reviews
    const reviews = await Review.find();
    for (const review of reviews) {
      if (review.image && review.image.startsWith('/uploads/')) {
        const fileName = review.image.replace('/uploads/', '');
        const filePath = path.join(uploadsDir, fileName);
        
        if (fs.existsSync(filePath)) {
          const cloudinaryUrl = await uploadToCloudinary(filePath, 'balaji-healthcare/reviews');
          if (cloudinaryUrl) {
            await Review.findByIdAndUpdate(review._id, { image: cloudinaryUrl });
            console.log(`Updated review with Cloudinary URL`);
          }
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateImages(); 