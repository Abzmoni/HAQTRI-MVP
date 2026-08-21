// backend/controllers/listingController.js
const Listing = require("../models/Listing");
const User = require("../models/User");

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      category, 
      type, 
      location, 
      specifications,
      contactInfo 
    } = req.body;
    
    const files = req.files || [];

    const media = files.map((file) => ({
      url: `/uploads/listings/${file.filename}`,
      type: file.mimetype.startsWith("video") ? "video" : "image",
    }));

    const listing = await Listing.create({
      user: req.user.id,
      title,
      description,
      price,
      category,
      type,
      location,
      specifications: specifications ? JSON.parse(specifications) : {},
      contactInfo: contactInfo ? JSON.parse(contactInfo) : {},
      media,
      isAvailable: true
    });

    const populatedListing = await Listing.findById(listing._id)
      .populate("user", "name email profilePic");

    res.status(201).json(populatedListing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all listings with filters
exports.getAllListings = async (req, res) => {
  try {
    const { 
      category, 
      type, 
      location, 
      minPrice, 
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const listings = await Listing.find(filter)
      .populate("user", "name email profilePic")
      .populate("comments.user", "name email profilePic")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
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

// Get single listing
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("user", "name email profilePic")
      .populate("comments.user", "name email profilePic")
      .populate("likes", "name email profilePic");
    
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    
    // Increment view count
    listing.views += 1;
    await listing.save();
    
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get listings by user
exports.getListingsByUser = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.params.userId })
      .populate("user", "name email profilePic")
      .populate("comments.user", "name email profilePic")
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update listing
exports.updateListing = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      category, 
      type, 
      location, 
      specifications,
      contactInfo,
      isAvailable 
    } = req.body;
    
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields if provided
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (category) listing.category = category;
    if (type) listing.type = type;
    if (location) listing.location = location;
    if (specifications) listing.specifications = JSON.parse(specifications);
    if (contactInfo) listing.contactInfo = JSON.parse(contactInfo);
    if (isAvailable !== undefined) listing.isAvailable = isAvailable;

    // Add new media if files are uploaded
    if (req.files && req.files.length > 0) {
      const media = req.files.map((file) => ({
        url: `/uploads/listings/${file.filename}`,
        type: file.mimetype.startsWith("video") ? "video" : "image",
      }));
      listing.media = [...listing.media, ...media];
    }

    const updated = await listing.save();
    const populated = await Listing.findById(updated._id)
      .populate("user", "name email profilePic")
      .populate("comments.user", "name email profilePic");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like or Unlike listing
exports.toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.likes.includes(req.user.id)) {
      // Unlike
      listing.likes = listing.likes.filter(
        (id) => id.toString() !== req.user.id.toString()
      );
    } else {
      // Like
      listing.likes.push(req.user.id);
    }

    await listing.save();
    
    // Populate likes before sending response
    const populated = await Listing.findById(listing._id)
      .populate("likes", "name email profilePic");
    
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment to listing
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const comment = {
      user: req.user.id,
      text,
    };

    listing.comments.push(comment);
    await listing.save();

    const updated = await Listing.findById(req.params.id)
      .populate("user", "name email profilePic")
      .populate("comments.user", "name email profilePic");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment from listing
exports.deleteComment = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const comment = listing.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    listing.comments = listing.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await listing.save();
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark listing as sold/unavailable
exports.toggleAvailability = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    listing.isAvailable = !listing.isAvailable;
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get listings by category
exports.getListingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const listings = await Listing.find({ 
      category, 
      isAvailable: true 
    })
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Listing.countDocuments({ 
      category, 
      isAvailable: true 
    });
    
    res.json({
      listings,
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

// Get featured listings
exports.getFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ 
      isAvailable: true,
      isFeatured: true 
    })
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const listingId = req.params.id;
    
    if (user.favorites.includes(listingId)) {
      return res.status(400).json({ message: "Listing already in favorites" });
    }
    
    user.favorites.push(listingId);
    await user.save();
    
    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const listingId = req.params.id;
    
    user.favorites = user.favorites.filter(
      id => id.toString() !== listingId
    );
    
    await user.save();
    
    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user favorites
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      populate: {
        path: 'user',
        select: 'name email profilePic'
      }
    });
    
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};