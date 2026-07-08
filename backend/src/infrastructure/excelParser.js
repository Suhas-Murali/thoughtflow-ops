const xlsx = require('xlsx');

/**
 * Reads an Excel file from disk and returns its rows as plain JS objects.
 * Each row's keys come from the column headers in the sheet.
 */
function parseExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);

  // We only read the first sheet — our sample files all use a single sheet.
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  // sheet_to_json converts the sheet into an array of objects,
  // e.g. [{ Execution_ID: 1, Test_ID: 'T-001', Error_Log: '...' }, ...]
  const rows = xlsx.utils.sheet_to_json(sheet);

  return rows;
}

module.exports = { parseExcelFile };