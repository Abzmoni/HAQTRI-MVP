// unified-server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Loading routes...\n');

// Load routes one by one with try-catch
try {
  console.log('1. Loading /api/auth...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✓ /api/auth loaded');
} catch (err) {
  console.error('✗ Error loading /api/auth:', err.message);
  process.exit(1);
}

try {
  console.log('2. Loading /api/users...');
  const userRoutes = require('./routes/user');
  app.use('/api/users', userRoutes);
  console.log('✓ /api/users loaded');
} catch (err) {
  console.error('✗ Error loading /api/users:', err.message);
  process.exit(1);
}

try {
  console.log('3. Loading /api/posts...');
  const postRoutes = require('./routes/postRoutes');
  app.use('/api/posts', postRoutes);
  console.log('✓ /api/posts loaded');
} catch (err) {
  console.error('✗ Error loading /api/posts:', err.message);
  process.exit(1);
}

try {
  console.log('4. Loading /api/status...');
  const statusRoutes = require('./routes/statusRoutes');
  app.use('/api/status', statusRoutes);
  console.log('✓ /api/status loaded');
} catch (err) {
  console.error('✗ Error loading /api/status:', err.message);
  process.exit(1);
}

try {
  console.log('5. Loading /api/listings...');
  const listingRoutes = require('./routes/listingRoutes');
  app.use('/api/listings', listingRoutes);
  console.log('✓ /api/listings loaded');
} catch (err) {
  console.error('✗ Error loading /api/listings:', err.message);
  process.exit(1);
}

try {
  console.log('6. Loading /api/live...');
  const liveStreamRoutes = require('./routes/liveStreamRoutes');
  app.use('/api/live', liveStreamRoutes);
  console.log('✓ /api/live loaded');
} catch (err) {
  console.error('✗ Error loading /api/live:', err.message);
  process.exit(1);
}

try {
  console.log('7. Loading /api/messages...');
  const messageRoutes = require('./routes/messageRoutes');
  app.use('/api/messages', messageRoutes);
  console.log('✓ /api/messages loaded');
} catch (err) {
  console.error('✗ Error loading /api/messages:', err.message);
  process.exit(1);
}

try {
  console.log('8. Loading /api/admin...');
  const adminRoutes = require('./routes/adminRoutes');
  app.use('/api/admin', adminRoutes);
  console.log('✓ /api/admin loaded');
} catch (err) {
  console.error('✗ Error loading /api/admin:', err.message);
  process.exit(1);
}

console.log('\n✅ All routes loaded successfully!');

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.send('Haqtri API running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});