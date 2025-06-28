const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/balaji_healthcare';

// MongoDB Models (same as server-mongo.cjs)
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

const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);
const Review = mongoose.model('Review', reviewSchema);
const SiteInfo = mongoose.model('SiteInfo', siteInfoSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Connect to SQLite
    const db = new sqlite3.Database('./site.db');

    // Migrate Products
    db.all('SELECT * FROM products', async (err, products) => {
      if (err) {
        console.error('Error reading products:', err);
      } else {
        console.log(`Found ${products.length} products to migrate`);
        for (const product of products) {
          try {
            await Product.create({
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              category: product.category || 'General',
              benefits: product.benefits ? JSON.parse(product.benefits) : [],
              rating: product.rating || 0,
              reviews: product.reviews || 0
            });
            console.log(`Migrated product: ${product.name}`);
          } catch (error) {
            console.error(`Error migrating product ${product.name}:`, error);
          }
        }
      }

      // Migrate Banners
      db.all('SELECT * FROM banners', async (err, banners) => {
        if (err) {
          console.error('Error reading banners:', err);
        } else {
          console.log(`Found ${banners.length} banners to migrate`);
          for (const banner of banners) {
            try {
              await Banner.create({
                image: banner.image,
                title: banner.title,
                subtitle: banner.subtitle,
                cta: banner.cta,
                ctaLink: banner.ctaLink
              });
              console.log(`Migrated banner: ${banner.title || banner.image}`);
            } catch (error) {
              console.error(`Error migrating banner:`, error);
            }
          }
        }

        // Migrate Reviews
        db.all('SELECT * FROM reviews', async (err, reviews) => {
          if (err) {
            console.error('Error reading reviews:', err);
          } else {
            console.log(`Found ${reviews.length} reviews to migrate`);
            for (const review of reviews) {
              try {
                await Review.create({
                  image: review.image,
                  text: review.text,
                  name: review.name || 'Customer',
                  rating: review.rating || 5
                });
                console.log(`Migrated review: ${review.name || 'Anonymous'}`);
              } catch (error) {
                console.error(`Error migrating review:`, error);
              }
            }
          }

          // Migrate Site Info
          db.all('SELECT * FROM site_info', async (err, siteInfos) => {
            if (err) {
              console.error('Error reading site_info:', err);
            } else {
              console.log(`Found ${siteInfos.length} site info entries to migrate`);
              for (const info of siteInfos) {
                try {
                  await SiteInfo.create({
                    key: info.key,
                    value: info.value
                  });
                  console.log(`Migrated site info: ${info.key}`);
                } catch (error) {
                  console.error(`Error migrating site info ${info.key}:`, error);
                }
              }
            }

            // Migrate Blog Posts
            db.all('SELECT * FROM blog_posts', async (err, blogPosts) => {
              if (err) {
                console.error('Error reading blog_posts:', err);
              } else {
                console.log(`Found ${blogPosts.length} blog posts to migrate`);
                for (const post of blogPosts) {
                  try {
                    await BlogPost.create({
                      title: post.title,
                      content: post.content,
                      excerpt: post.excerpt,
                      image_url: post.image_url,
                      author: post.author || 'Admin',
                      is_published: post.is_published === 1
                    });
                    console.log(`Migrated blog post: ${post.title}`);
                  } catch (error) {
                    console.error(`Error migrating blog post ${post.title}:`, error);
                  }
                }
              }

              console.log('Migration completed!');
              db.close();
              mongoose.connection.close();
            });
          });
        });
      });
    });

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateData(); 