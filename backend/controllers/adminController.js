// backend/controllers/adminController.js
const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify a user
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    user.verificationStatus = 'approved';
    await user.save();

    res.json({ message: 'User verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get platform stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    // Add more stats if needed (e.g., listings)
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
