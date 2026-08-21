const mongoose = require("mongoose");

// Schema for individual status items (images/videos/audio)
const statusItemSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },  // ✅ Match your database field
  mediaType: { type: String, enum: ["image", "video", "audio"], required: true }, // ✅ Match database
  caption: { type: String, default: "" },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const musicSchema = new mongoose.Schema({
  url: { type: String },
  title: { type: String },
  artist: { type: String },
});

const statusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [statusItemSchema], // ✅ Use 'items' to match your database records
    music: musicSchema,
    isLive: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto-delete expired statuses
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Status", statusSchema);