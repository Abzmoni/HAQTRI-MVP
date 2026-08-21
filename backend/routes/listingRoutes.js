const express = require("express");
const router = express.Router();

const {
  createListing,
  getAllListings,
  getListingById,
  getListingsByUser,
  updateListing,
  deleteListing,
  toggleLike,
  addComment,
  deleteComment,
  toggleAvailability,
  getListingsByCategory,
  getFeaturedListings,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} = require("../controllers/listingController");

const { protect } = require("../middleware/auth");
const { upload, handleUploadErrors } = require("../middleware/upload");

// SPECIFIC ROUTES FIRST
router.get("/user/:userId", getListingsByUser);
router.get("/category/:category", getListingsByCategory);
router.get("/featured", getFeaturedListings); // CHANGED: Removed duplicate "featured"
router.get("/favorites/mine", protect, getUserFavorites);

// GENERIC ROUTES
router.get("/", getAllListings);

// Create new listing
router.post(
  "/",
  protect,
  upload.array("media", 10),
  handleUploadErrors,
  createListing
);

// Routes with ID - MUST COME AFTER ALL SPECIFIC ROUTES
router.get("/:id", getListingById);
router.put(
  "/:id",
  protect,
  upload.array("media", 10),
  handleUploadErrors,
  updateListing
);
router.delete("/:id", protect, deleteListing);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);
router.delete("/:listingId/comments/:commentId", protect, deleteComment);
router.put("/:id/availability", protect, toggleAvailability);
router.post("/:id/favorite", protect, addToFavorites);
router.delete("/:id/favorite", protect, removeFromFavorites);

module.exports = router;