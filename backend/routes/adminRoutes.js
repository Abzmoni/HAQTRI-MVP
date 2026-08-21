// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  verifyUser,
  updateUserRole,
  getPlatformStats
} = require('../controllers/adminController');

const { protect, admin: adminMiddleware } = require('../middleware/auth');

// Apply protection and admin check to all routes
router.use(protect, adminMiddleware);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:id/verify', verifyUser);
router.patch('/users/:id/role', updateUserRole);

// Platform stats
router.get('/stats', getPlatformStats);

module.exports = router;
