const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const BATCH_SIZE = 10;

/**
 * Splits an array into chunks of a given size.
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Sends failures to the AI service in small batches, rather than all at once.
 * Calls onBatchComplete after each batch finishes, so callers can persist
 * results incrementally instead of holding everything in memory until the end.
 */
async function analyzeFailures(failures, onBatchComplete) {
  const batches = chunkArray(failures, BATCH_SIZE);
  const allResults = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const payload = {
      failures: batch.map((f) => ({
        id: f.id,
        rawErrorLog: f.rawErrorLog,
      })),
    };

    console.log(`Analyzing batch ${i + 1}/${batches.length} (${batch.length} rows)...`);
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/analyze`, payload);
    const batchResults = response.data.results;

    if (onBatchComplete) {
      await onBatchComplete(batchResults);
    }

    allResults.push(...batchResults);
  }

  return allResults;
}

module.exports = { analyzeFailures };