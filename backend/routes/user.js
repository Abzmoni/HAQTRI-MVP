const express = require('express');
const router = express.Router();

const { 
  getProfile, 
  updateProfile, 
  getUserProfile,
  submitVerification,
  toggleFollow,
  searchUsers
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { upload, handleUploadErrors } = require('../middleware/upload');

// GET logged-in user profile
router.get('/profile', protect, getProfile);

// UPDATE logged-in user profile
router.put(
  '/profile',
  protect,
  upload.single('profilePic'),
  handleUploadErrors,
  updateProfile
);

// SUBMIT verification documents
router.post(
  '/verification',
  protect,
  upload.array('documents', 5),
  handleUploadErrors,
  submitVerification
);

// SEARCH users - Use a different path to avoid conflict
router.get('/search/all', protect, searchUsers); // Changed from '/search/users'

// PUBLIC user profile - Should be LAST
router.get('/:id', getUserProfile);

// FOLLOW/UNFOLLOW user
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;