const express = require('express');
const { getFailures } = require('../application/getFailures');
const authenticateJWT = require('../infrastructure/authenticateJWT');

const router = express.Router();

router.get('/failures', authenticateJWT, async (req, res) => {
  try {
    const { search, category, severity, sortBy, sortOrder } = req.query;
    const failures = await getFailures({ search, category, severity, sortBy, sortOrder });
    res.status(200).json({ failures });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch failures.', details: err.message });
  }
});

module.exports = router;