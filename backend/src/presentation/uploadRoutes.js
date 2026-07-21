const express = require('express');
const multer = require('multer');
const { parseExcelFile } = require('../infrastructure/excelParser');
const { saveParsedFile } = require('../application/saveParsedFile');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
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

  try {
    const savedFile = await saveParsedFile({
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      sizeInBytes: req.file.size,
      rows,
    });

    res.status(201).json({
      message: 'File parsed and saved successfully.',
      uploadedFileId: savedFile.id,
      originalName: savedFile.originalName,
      rowCount: savedFile.failures.length,
      failures: savedFile.failures,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to save parsed data to the database.',
      details: err.message,
    });
  }
});

module.exports = router;