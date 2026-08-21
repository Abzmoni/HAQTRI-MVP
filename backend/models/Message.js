const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    trim: true
  },
  media: {
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'file']
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);