const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: {
      url: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], required: true },
    },
    music: {
      title: { type: String },
      artist: { type: String },
      url: { type: String }, // optional background music
    },
    isLive: { type: Boolean, default: false },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, required: true }, // auto-expiry 24hrs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
