const User = require('../models/User');
const bcrypt = require('bcryptjs');

// =========================
// GET logged-in user profile
// =========================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// UPDATE logged-in user profile
// =========================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, phone } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Handle profile picture update
    if (req.file) {
      user.profilePic = req.file.path;
    }

    // Hash password if updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePic: updatedUser.profilePic
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET PUBLIC USER PROFILE
// =========================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// SUBMIT VERIFICATION DOCUMENTS
// =========================
exports.submitVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add uploaded documents
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        user.verificationDocuments.push({
          documentType: file.fieldname,
          documentUrl: file.path,
          uploadedAt: new Date()
        });
      });
    }

    user.verificationStatus = "pending";
    await user.save();

    res.json({ message: "Verification documents submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// FOLLOW / UNFOLLOW USER
// =========================
exports.toggleFollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    if (userId === targetId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) return res.status(404).json({ message: "User not found" });

    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      // Unfollow
      user.following = user.following.filter(id => id.toString() !== targetId);
      target.followers = target.followers.filter(id => id.toString() !== userId);
    } else {
      // Follow
      user.following.push(targetId);
      target.followers.push(userId);
    }

    await user.save();
    await target.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// SEARCH USERS
// =========================
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q || "";

    const users = await User.find({
      name: { $regex: q, $options: "i" }
    }).select('name email profilePic');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
