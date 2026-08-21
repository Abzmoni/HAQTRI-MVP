// backend/models/Listing.js
const mongoose = require("mongoose");

// Comment schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Media schema
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
});

const listingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ["property", "materials", "labour"] 
    },
    type: { 
      type: String, 
      required: true,
      enum: {
        property: ["house", "apartment", "land", "commercial"],
        materials: ["cement", "roofing", "tiles", "doors", "windows", "plumbing", "electrical"],
        labour: ["mason", "carpenter", "electrician", "plumber", "painter", "tiler", "welder"]
      }[this.category]
    },
    location: { type: String, required: true, trim: true },
    specifications: {
      // Property specifications
      bedrooms: { type: Number },
      bathrooms: { type: Number },
      area: { type: Number }, // in square meters/feet
      // Material specifications
      brand: { type: String },
      quantity: { type: Number },
      unit: { type: String },
      // Labour specifications
      experience: { type: String }, // years of experience
      skills: [{ type: String }],
      availability: { type: String }
    },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String }
    },
    media: [mediaSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    views: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for better search performance
listingSchema.index({ category: 1, type: 1, location: 1, price: 1 });
listingSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Listing", listingSchema);