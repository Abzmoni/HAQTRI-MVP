const express = require("express");
const router = express.Router();

const {
  createStream,
  getAllStreams,
  getStream,
  getUserStreams,
  updateStream,
  startStream,
  endStream,
  addViewer,
  removeViewer,
  deleteStream
} = require("../controllers/liveStreamController");

const { protect } = require("../middleware/auth");

// CREATE STREAM
router.post("/", protect, createStream);

// GET ALL STREAMS
router.get("/", getAllStreams);

// GET USER STREAMS
router.get("/user/:userId", getUserStreams);

// GET SINGLE STREAM
router.get("/:id", getStream);

// UPDATE STREAM
router.put("/:id", protect, updateStream);

// START STREAM
router.patch("/:id/start", protect, startStream);

// END STREAM
router.patch("/:id/end", protect, endStream);

// ADD VIEWER
router.patch("/:id/view", protect, addViewer);

// REMOVE VIEWER
router.patch("/:id/leave", protect, removeViewer);

// DELETE STREAM
router.delete("/:id", protect, deleteStream);

module.exports = router;
