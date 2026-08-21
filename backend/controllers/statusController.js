// backend/controllers/statusController.js
const Status = require("../models/Status");

// Upload new status (image/video/audio)
exports.createStatus = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No media uploaded" });
    }

    const mediaItems = req.files.map((file) => {
      let mediaType = "image";
      if (file.mimetype.startsWith("video")) mediaType = "video";
      else if (file.mimetype.startsWith("audio")) mediaType = "audio";

      return {
        mediaUrl: `/uploads/posts/${file.filename}`,
        mediaType: mediaType,
        caption: req.body.caption || "",
        views: [],
      };
    });

    const status = await Status.create({
      user: req.user.id,
      items: mediaItems,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const populatedStatus = await Status.findById(status._id)
      .populate("user", "name email");

    res.status(201).json(populatedStatus);
  } catch (err) {
    console.error("Create Status Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all active statuses
exports.getAllStatuses = async (req, res) => {
  try {
    const now = new Date();
    const statuses = await Status.find({ expiresAt: { $gt: now } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(statuses);
  } catch (err) {
    console.error("Get Statuses Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single status
exports.getStatusById = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id)
      .populate("user", "name email");
    if (!status) return res.status(404).json({ message: "Status not found" });
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark status as viewed
exports.viewStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ message: "Status not found" });

    let viewed = false;
    status.items.forEach((item) => {
      if (!item.views.includes(req.user.id)) {
        item.views.push(req.user.id);
        viewed = true;
      }
    });

    if (viewed) await status.save();

    res.json({
      message: "Viewed",
      totalViews: status.items.reduce((acc, item) => acc + item.views.length, 0),
    });
  } catch (err) {
    console.error("View Status Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a status (only by owner)
exports.deleteStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ message: "Status not found" });

    if (status.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await status.deleteOne();
    res.json({ message: "Status deleted" });
  } catch (err) {
    console.error("Delete Status Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Set user as live (circle indicator)
exports.setLiveStatus = async (req, res) => {
  try {
    let status = await Status.findOne({ user: req.user.id });

    if (!status) {
      status = await Status.create({
        user: req.user.id,
        items: [],
        isLive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    } else {
      status.isLive = true;
      await status.save();
    }

    res.json({ message: "User is live", status });
  } catch (err) {
    console.error("Set Live Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// End live session
exports.endLiveStatus = async (req, res) => {
  try {
    const status = await Status.findOne({ user: req.user.id });
    if (!status) return res.status(404).json({ message: "No live status found" });

    status.isLive = false;
    await status.save();

    res.json({ message: "Live ended", status });
  } catch (err) {
    console.error("End Live Error:", err);
    res.status(500).json({ message: err.message });
  }
};