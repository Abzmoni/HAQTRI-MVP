const mongoose = require("mongoose");

// Comment schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users can like comments too
  },
  { timestamps: true }
);

// Media schema
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
});

// Music schema
const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, trim: true },
  url: { type: String, required: true }, // audio file
});

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    media: [mediaSchema],
    music: musicSchema, // optional music attachment
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);
