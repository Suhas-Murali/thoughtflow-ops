const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Sends a batch of failures to the Python AI service for categorization,
 * and returns the results keyed by failure id.
 */
async function analyzeFailures(failures) {
  const payload = {
    failures: failures.map((f) => ({
      id: f.id,
      rawErrorLog: f.rawErrorLog,
    })),
  };

  const response = await axios.post(`${AI_SERVICE_URL}/api/v1/analyze`, payload);
  return response.data.results;
}

module.exports = { analyzeFailures };