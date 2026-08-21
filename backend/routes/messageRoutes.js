const express = require("express");
const router = express.Router();

const {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  markAsRead,
  getUserConversations
} = require("../controllers/messageController");

const { protect } = require("../middleware/auth");

// ✅ Correct Multer import
const { upload, handleUploadErrors } = require("../middleware/upload");

// Get or create conversation
router.get("/conversation/:userId", protect, getOrCreateConversation);

// Get user conversations
router.get("/conversations", protect, getUserConversations);

// Send message with optional media (1 file max)
router.post(
  "/:conversationId",
  protect,
  upload.array("media", 1),
  handleUploadErrors,
  sendMessage
);

// Get conversation messages
router.get("/:conversationId/messages", protect, getMessages);

// Mark messages as read
router.put("/:conversationId/read", protect, markAsRead);

module.exports = router;
