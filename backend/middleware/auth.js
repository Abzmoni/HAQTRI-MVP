// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes (requires valid JWT)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Update last active
      await req.user.updateLastActive();

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only middleware
const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Verified user middleware (optional, for listings)
const verified = (req, res, next) => {
  if (req.user?.isVerified) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Verified account required. Please submit verification documents.' 
    });
  }
};

module.exports = { protect, admin, verified };
