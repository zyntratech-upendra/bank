const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ secure_url: req.file.path });
  } catch (error) {
    console.error('Error uploading to Cloudinary via Server:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

module.exports = router;
