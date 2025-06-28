const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SQLite DB setup
const db = new sqlite3.Database('./site.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    // Create tables if they don't exist
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        image TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT NOT NULL,
        title TEXT,
        subtitle TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        text TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS site_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        excerpt TEXT,
        image_url TEXT,
        author TEXT DEFAULT 'Admin',
        is_published BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`);
      // Seed a demo blog post if table is empty
      db.get('SELECT * FROM blog_posts LIMIT 1', (err, row) => {
        if (!row) {
          db.run(
            `INSERT INTO blog_posts (title, content, excerpt, image_url, author, is_published) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              'Welcome to the Blog!',
              'This is your first blog post. Edit or add more posts from the database.',
              'A short excerpt for the first post.',
              'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80',
              'Admin',
              1
            ]
          );
        }
      });
    });
    // Insert default admin if not exists
    db.get('SELECT * FROM admin WHERE username = ?', ['admin'], (err, row) => {
      if (!row) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.run('INSERT INTO admin (username, password) VALUES (?, ?)', ['admin', hashedPassword], (err) => {
          if (err) {
            console.error('Error creating default admin:', err);
          } else {
            console.log('Default admin user created: admin / admin123');
          }
        });
      }
      // Insert 'shubham' admin if not exists
      const shubhamUsername = 'shubham';
      db.get('SELECT * FROM admin WHERE username = ?', [shubhamUsername], (err, row) => {
        if (!row) {
          const shubhamPassword = bcrypt.hashSync('shubham@123', 10);
          db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [shubhamUsername, shubhamPassword], (err) => {
            if (err) {
              console.error('Error creating shubham admin:', err);
            } else {
              console.log('Admin user created: shubham / shubham@123');
            }
          });
        }
      });
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admin WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Create JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });
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

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Image upload endpoint (admin only)
app.post('/api/upload', authenticateToken, (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Headers:', req.headers);
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message || 'Image upload failed' });
    }
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File uploaded:', req.file.filename);
    res.json({ path: `/uploads/${req.file.filename}` });
  });
});

// PRODUCTS CRUD
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    // Map image to image_url with /uploads/ prefix
    const products = rows.map(row => ({
      ...row,
      image_url: row.image ? `/uploads/${row.image}` : ''
    }));
    res.json(products);
  });
});
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, description, price, image } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.run(
    'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
    [name, description, price, image],
    function (err) {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID });
    }
  );
});
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { name, description, price, image } = req.body;
  db.run('UPDATE products SET name=?, description=?, price=?, image=? WHERE id=?', [name, description, price, image, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ updated: this.changes });
  });
});
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM products WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ deleted: this.changes });
  });
});

// BANNERS CRUD
app.get('/api/banners', (req, res) => {
  db.all('SELECT * FROM banners', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});
app.post('/api/banners', authenticateToken, (req, res) => {
  const { image, title, subtitle } = req.body;
  db.run('INSERT INTO banners (image, title, subtitle) VALUES (?, ?, ?)', [image, title, subtitle], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id: this.lastID });
  });
});
app.put('/api/banners/:id', authenticateToken, (req, res) => {
  const { image, title, subtitle } = req.body;
  db.run('UPDATE banners SET image=?, title=?, subtitle=? WHERE id=?', [image, title, subtitle, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ updated: this.changes });
  });
});
app.delete('/api/banners/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM banners WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ deleted: this.changes });
  });
});

// REVIEWS CRUD
app.get('/api/reviews', (req, res) => {
  db.all('SELECT * FROM reviews', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});
app.post('/api/reviews', authenticateToken, (req, res) => {
  const { image, text } = req.body;
  db.run('INSERT INTO reviews (image, text) VALUES (?, ?)', [image, text], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id: this.lastID });
  });
});
app.put('/api/reviews/:id', authenticateToken, (req, res) => {
  const { image, text } = req.body;
  db.run('UPDATE reviews SET image=?, text=? WHERE id=?', [image, text, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ updated: this.changes });
  });
});
app.delete('/api/reviews/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM reviews WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ deleted: this.changes });
  });
});

// SITE INFO CRUD
app.get('/api/site-info', (req, res) => {
  db.all('SELECT * FROM site_info', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});
app.post('/api/site-info', authenticateToken, (req, res) => {
  const { key, value } = req.body;
  db.run('INSERT OR REPLACE INTO site_info (key, value) VALUES (?, ?)', [key, value], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id: this.lastID });
  });
});
app.put('/api/site-info/:key', authenticateToken, (req, res) => {
  const { value } = req.body;
  db.run('UPDATE site_info SET value=? WHERE key=?', [value, req.params.key], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ updated: this.changes });
  });
});
app.delete('/api/site-info/:key', authenticateToken, (req, res) => {
  db.run('DELETE FROM site_info WHERE key=?', [req.params.key], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ deleted: this.changes });
  });
});

// BLOG POSTS CRUD
app.get('/api/blog-posts', (req, res) => {
  db.all('SELECT * FROM blog_posts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Create blog post
app.post('/api/blog-posts', authenticateToken, (req, res) => {
  const { title, content, excerpt, image_url, author, is_published } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  db.run(
    `INSERT INTO blog_posts (title, content, excerpt, image_url, author, is_published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [title, content, excerpt, image_url, author, is_published ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: this.lastID });
    }
  );
});

// Update blog post
app.put('/api/blog-posts/:id', authenticateToken, (req, res) => {
  const { title, content, excerpt, image_url, author, is_published } = req.body;
  db.run(
    `UPDATE blog_posts SET title=?, content=?, excerpt=?, image_url=?, author=?, is_published=?, updated_at=datetime('now') WHERE id=?`,
    [title, content, excerpt, image_url, author, is_published ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ updated: this.changes });
    }
  );
});

// Delete blog post
app.delete('/api/blog-posts/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM blog_posts WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ deleted: this.changes });
  });
});

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
  const { first_name, last_name, phone, subject, message } = req.body;
  if (!first_name || !last_name || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO contact_messages (first_name, last_name, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, phone, subject, message],
    function (err) {
      if (err) {
        console.error('Error saving contact message:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Get all contact messages (admin only)
app.get('/api/contact-messages', authenticateToken, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Global error handler (add this at the end of the file)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 