const express = require('express');
const multer = require('multer');
const { parseExcelFile } = require('../infrastructure/excelParser');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  let rows;
  try {
    rows = parseExcelFile(req.file.path);
  } catch (err) {
    return res.status(400).json({
      error: 'The uploaded file could not be read as a valid spreadsheet.',
      details: err.message,
    });
  }

  res.status(200).json({
    message: 'File received and parsed successfully.',
    originalName: req.file.originalname,
    savedAs: req.file.filename,
    sizeInBytes: req.file.size,
    rowCount: rows.length,
    rows,
  });
});

module.exports = router;