const LiveStream = require("../models/LiveStream");
const User = require("../models/User");

// Create a new live stream
exports.createStream = async (req, res) => {
  try {
    console.log("Creating stream with data:", req.body);
    console.log("User ID:", req.user.id);
    
    const { title, description, category, tags } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        message: "Title is required" 
      });
    }
    
    // Check if user already has an active stream
    const existingStream = await LiveStream.findOne({ 
      user: req.user.id, 
      isLive: true 
    });
    
    if (existingStream) {
      return res.status(400).json({ 
        message: "You already have an active live stream" 
      });
    }
    
    // Use default values if environment variables aren't set
    const rtmpServer = process.env.RTMP_SERVER || 'localhost';
    const cdnDomain = process.env.CDN_DOMAIN || 'localhost';
    
    // Generate a unique stream key
    const streamKey = `haqtri_${req.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create stream manually to ensure streamKey is set
    const stream = new LiveStream({
      user: req.user.id,
      title,
      description: description || "",
      category: category || "Real Estate",
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      rtmpUrl: `rtmp://${rtmpServer}/live`,
      playbackUrl: `https://${cdnDomain}/live`,
      streamKey: streamKey // Manually set the streamKey
    });
    
    // Save the stream
    await stream.save();
    
    console.log("Stream created successfully:", stream);
    
    const populatedStream = await LiveStream.findById(stream._id)
      .populate("user", "name email profilePic");
    
    res.status(201).json(populatedStream);
  } catch (err) {
    console.error("Error creating stream:", err);
    res.status(500).json({ 
      message: err.message,
      error: "Failed to create live stream. Please try again." 
    });
  }
};

// Get all live streams
exports.getAllStreams = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isLive: true };
    
    if (category && category !== "all") {
      filter.category = category;
    }
    
    const streams = await LiveStream.find(filter)
      .populate("user", "name email profilePic")
      .sort({ viewerCount: -1, createdAt: -1 });
    
    res.json(streams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single stream
exports.getStream = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id)
      .populate("user", "name email profilePic")
      .populate("viewers", "name profilePic");
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    res.json(stream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's streams
exports.getUserStreams = async (req, res) => {
  try {
    const streams = await LiveStream.find({ user: req.params.userId })
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });
    
    res.json(streams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update stream (title, description, etc.)
exports.updateStream = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    if (stream.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    if (title) stream.title = title;
    if (description) stream.description = description;
    if (category) stream.category = category;
    if (tags) stream.tags = tags.split(",").map(tag => tag.trim());
    
    const updated = await stream.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Start stream (set isLive to true)
exports.startStream = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    if (stream.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    stream.isLive = true;
    stream.startedAt = new Date();
    stream.viewerCount = 0;
    stream.viewers = [];
    
    const updated = await stream.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// End stream (set isLive to false)
exports.endStream = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    if (stream.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    stream.isLive = false;
    stream.endedAt = new Date();
    stream.duration = Math.floor((stream.endedAt - stream.startedAt) / 1000);
    
    const updated = await stream.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add viewer to stream
exports.addViewer = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    if (!stream.viewers.includes(req.user.id)) {
      stream.viewers.push(req.user.id);
      stream.viewerCount += 1;
      await stream.save();
    }
    
    res.json({ message: "Viewer added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove viewer from stream
exports.removeViewer = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    if (stream.viewers.includes(req.user.id)) {
      stream.viewers = stream.viewers.filter(
        viewerId => viewerId.toString() !== req.user.id
      );
      stream.viewerCount = Math.max(0, stream.viewerCount - 1);
      await stream.save();
    }
    
    res.json({ message: "Viewer removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete stream
exports.deleteStream = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    
    if (stream.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    await LiveStream.deleteOne({ _id: req.params.id });
    res.json({ message: "Stream deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};