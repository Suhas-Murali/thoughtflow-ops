const prisma = require('../infrastructure/prismaClient');

/**
 * Saves an uploaded file's metadata and its parsed rows into the database.
 * Returns the created UploadedFile record (including its generated id).
 */
async function saveParsedFile({ originalName, savedAs, sizeInBytes, rows, uploadedById }) {
  const uploadedFile = await prisma.uploadedFile.create({
    data: {
      originalName,
      savedAs,
      sizeInBytes,
      uploadedById,
      failures: {
        create: rows.map((row) => ({
          testId: String(row.Test_ID ?? 'UNKNOWN'),
          testName: String(row.Test_Name ?? 'UNKNOWN'),
          rawErrorLog: String(row.Error_Log ?? ''),
          category: 'PENDING_ANALYSIS',
          severity: 'PENDING_ANALYSIS',
          cleanSummary: 'PENDING_ANALYSIS',
        })),
      },
    },
    include: {
      failures: true,
    },
  });

  return uploadedFile;
}

module.exports = { saveParsedFile };