const express = require("express");
const router = express.Router();

const {
  createStatus,
  getAllStatuses,
  getStatusById,
  viewStatus,
  deleteStatus,
  setLiveStatus,
  endLiveStatus,
} = require("../controllers/statusController");

const { protect } = require("../middleware/auth");

// ✅ Correct import of Multer instance for statuses (using posts storage)
const { upload, handleUploadErrors } = require("../middleware/upload");

// Create status (supports image, video, audio)
router.post(
  "/",
  protect,
  upload.array("media", 3),
  handleUploadErrors,
  createStatus
);

// Get all active statuses
router.get("/", protect, getAllStatuses);

// Get single status
router.get("/:id", protect, getStatusById);

// Mark status as viewed
router.put("/:id/view", protect, viewStatus);

// Delete status
router.delete("/:id", protect, deleteStatus);

// Set live status
router.put("/live/set", protect, setLiveStatus);

// End live status
router.put("/live/end", protect, endLiveStatus);

module.exports = router;
