const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  sharePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/auth");
const { upload, handleUploadErrors } = require("../middleware/upload");

// CREATE POST
router.post(
  "/",
  protect,
  upload.array("media", 5),
  handleUploadErrors,
  createPost
);

// GET ALL POSTS
router.get("/", protect, getAllPosts);

// GET SINGLE POST
router.get("/:id", protect, getPostById);

// UPDATE POST
router.put(
  "/:id",
  protect,
  upload.array("media", 5),
  handleUploadErrors,
  updatePost
);

// DELETE POST
router.delete("/:id", protect, deletePost);

// LIKE / UNLIKE POST (single endpoint for both)
router.post("/:id/like", protect, toggleLike); // REMOVE the /:id/unlike route

// COMMENTS
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

// SHARE POST
router.post("/:id/share", protect, sharePost);

module.exports = router;