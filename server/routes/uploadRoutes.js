const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploaded file path:', req.file.path); // DEBUG LOG
    
    res.status(200).json({ 
      message: 'File uploaded successfully',
      url: req.file.path // This should be full Cloudinary URL
    });
  } catch (error) {
    console.error('Upload error:', error); // DEBUG LOG
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;