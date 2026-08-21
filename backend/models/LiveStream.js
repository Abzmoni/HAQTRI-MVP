  const mongoose = require("mongoose");

  const liveStreamSchema = new mongoose.Schema(
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
      title: { 
        type: String, 
        required: true, 
        trim: true 
      },
      description: { 
        type: String, 
        trim: true 
      },
      streamKey: { 
        type: String, 
        required: true, 
        unique: true 
      },
      rtmpUrl: { 
        type: String, 
        required: true 
      },
      playbackUrl: { 
        type: String 
      },
      thumbnail: { 
        type: String 
      },
      category: { 
        type: String, 
        default: "Real Estate" 
      },
      tags: [{ 
        type: String, 
        trim: true 
      }],
      isLive: { 
        type: Boolean, 
        default: false 
      },
      viewers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }],
      viewerCount: { 
        type: Number, 
        default: 0 
      },
      duration: { 
        type: Number, 
        default: 0 
      },
      startedAt: { 
        type: Date 
      },
      endedAt: { 
        type: Date 
      }
    },
    { timestamps: true }
  );

  // Remove the pre-save hook since we're generating the stream key in the controller

  module.exports = mongoose.model("LiveStream", liveStreamSchema);