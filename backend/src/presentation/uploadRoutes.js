const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  res.status(200).json({
    message: 'File received successfully.',
    originalName: req.file.originalname,
    savedAs: req.file.filename,
    sizeInBytes: req.file.size,
  });
});

module.exports = router;