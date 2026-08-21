const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Enhanced register with profile data
exports.register = async (req, res) => {
  const { name, email, password, phone, bio, location } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ 
      name, 
      email, 
      password, 
      phone,
      bio,
      location
    });
    
    await user.updateLastActive();
    
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      location: user.location,
      isVerified: user.isVerified,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Enhanced login with full user data
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      await user.updateLastActive();
      
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        location: user.location,
        isVerified: user.isVerified,
        role: user.role,
        followers: user.followers,
        following: user.following,
        token: generateToken(user._id)
      });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('followers', 'name profilePic')
      .populate('following', 'name profilePic');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};