const prisma = require('../infrastructure/prismaClient');

// Temporary: hardcoded system user until real auth (Days 7-8) exists.
const TEMP_SYSTEM_USER_ID = '0c71d8dd-8739-4794-8893-60294ade9348';

/**
 * Saves an uploaded file's metadata and its parsed rows into the database.
 * Returns the created UploadedFile record (including its generated id).
 */
async function saveParsedFile({ originalName, savedAs, sizeInBytes, rows }) {
  const uploadedFile = await prisma.uploadedFile.create({
    data: {
      originalName,
      savedAs,
      sizeInBytes,
      uploadedById: TEMP_SYSTEM_USER_ID,
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