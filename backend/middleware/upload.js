const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/posts',
    'uploads/profiles', 
    'uploads/listings',
    'uploads/verification',
    'uploads/messages'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, "..", dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

createUploadDirs();

// Dynamic storage based on field name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/posts'; // default
    
    if (req.baseUrl.includes('users') && file.fieldname === 'profilePic') {
      uploadPath = 'uploads/profiles';
    } else if (req.baseUrl.includes('users') && file.fieldname === 'documents') {
      uploadPath = 'uploads/verification';
    } else if (req.baseUrl.includes('messages')) {
      uploadPath = 'uploads/messages';
    } else if (req.baseUrl.includes('listings')) {
      uploadPath = 'uploads/listings';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png", 
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/avi",
    "application/pdf", // for documents
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = { upload, handleUploadErrors };