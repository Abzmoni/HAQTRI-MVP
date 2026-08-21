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

// MANUALLY DEFINE ROUTES WITHOUT ROUTER MODULES
// This avoids path-to-regexp parsing issues

// Auth routes
const { register, login } = require('./controllers/authController');
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// User routes
const { 
  getProfile, 
  updateProfile, 
  getUserProfile,
  submitVerification,
  toggleFollow,
  searchUsers
} = require('./controllers/userController');
const { protect } = require('./middleware/auth');
const { upload, handleUploadErrors } = require('./middleware/upload');

app.get('/api/users/profile', protect, getProfile);
app.put('/api/users/profile', protect, upload.single('profilePic'), handleUploadErrors, updateProfile);
app.post('/api/users/verification', protect, upload.array('documents', 5), handleUploadErrors, submitVerification);
app.get('/api/users/search', protect, searchUsers); // Fixed path
app.get('/api/users/:id', getUserProfile);
app.post('/api/users/:id/follow', protect, toggleFollow);

// Add other routes similarly...
// For now, let's keep it minimal and add routes gradually

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
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;