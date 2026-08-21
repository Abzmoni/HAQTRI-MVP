const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Start or get conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'Cannot message yourself' });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] }
    }).populate('participants', 'name profilePic isVerified');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [currentUserId, userId]
      });
      
      await conversation.populate('participants', 'name profilePic isVerified');
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const files = req.files || [];

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const receiverId = conversation.participants.find(
      id => id.toString() !== req.user.id.toString()
    );

    let media = null;
    if (files.length > 0) {
      const file = files[0];
      media = {
        url: `/uploads/messages/${file.filename}`,
        type: file.mimetype.startsWith('image') ? 'image' : 
              file.mimetype.startsWith('video') ? 'video' : 'file'
      };
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver: receiverId,
      text,
      media
    });

    // Update conversation last message and unread count
    conversation.lastMessage = message._id;
    
    // Increment unread count for receiver
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePic')
      .populate('receiver', 'name profilePic');

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conversation messages
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name profilePic')
      .populate('receiver', 'name profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments({ conversation: conversationId });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Reset unread count for current user
    conversation.unreadCount.set(req.user.id.toString(), 0);
    await conversation.save();

    // Mark messages as read
    await Message.updateMany(
      { 
        conversation: conversationId,
        receiver: req.user.id,
        read: false
      },
      { 
        read: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user conversations
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name profilePic isVerified')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};