const express = require('express');
const multer = require('multer');
const { parseExcelFile } = require('../infrastructure/excelParser');
const { saveParsedFile } = require('../application/saveParsedFile');
const { analyzeFailures } = require('../application/analyzeFailures');
const authenticateJWT = require('../infrastructure/authenticateJWT');
const requireRole = require('../infrastructure/requireRole');
const prisma = require('../infrastructure/prismaClient');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/upload',
  authenticateJWT,
  requireRole(['QA_LEAD', 'ADMIN']),
  upload.single('file'),
  async (req, res) => {
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
        uploadedById: req.user.userId,
      });

      // Send saved failures to the AI service for categorization
      const analysisResults = await analyzeFailures(savedFile.failures);

      // Update each failure in the database with its real AI analysis
      await Promise.all(
        analysisResults.map((result) =>
          prisma.parsedFailure.update({
            where: { id: result.id },
            data: {
              category: result.category,
              severity: result.severity,
              cleanSummary: result.cleanSummary,
            },
          })
        )
      );

      res.status(201).json({
        message: 'File parsed, saved, and analyzed successfully.',
        uploadedFileId: savedFile.id,
        originalName: savedFile.originalName,
        rowCount: savedFile.failures.length,
        failures: analysisResults,
      });
    } catch (err) {
      res.status(500).json({
        error: 'Failed to save or analyze parsed data.',
        details: err.message,
      });
    }
  }
);

module.exports = router;