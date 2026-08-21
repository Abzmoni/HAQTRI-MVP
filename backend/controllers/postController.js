// backend/controllers/postController.js
const Post = require("../models/Posts");
const User = require("../models/User");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { text, music } = req.body;
    const files = req.files || [];

    const media = files.map((file) => ({
      url: `/uploads/posts/${file.filename}`,
      type: file.mimetype.startsWith("video") ? "video" : "image",
    }));

    const post = await Post.create({
      user: req.user.id,
      text,
      media,
      music: music ? JSON.parse(music) : null, // { title, artist, url }
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts (feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get posts by user
exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update post (text/media/music)
exports.updatePost = async (req, res) => {
  try {
    const { text, music } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (text) post.text = text;
    if (music) post.music = JSON.parse(music);

    if (req.files && req.files.length > 0) {
      const media = req.files.map((file) => ({
        url: `/uploads/posts/${file.filename}`,
        type: file.mimetype.startsWith("video") ? "video" : "image",
      }));
      post.media = [...post.media, ...media];
    }

    const updated = await post.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.remove();
    res.json({ message: "Post removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like or Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user.id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    const updated = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Share post
exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const sharedPost = await Post.create({
      user: req.user.id,
      text: `Shared post: ${post.text}`,
      media: post.media,
      music: post.music || null,
    });

    res.status(201).json(sharedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
