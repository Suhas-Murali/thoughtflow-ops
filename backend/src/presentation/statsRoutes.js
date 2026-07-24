const express = require('express');
const { getDashboardStats } = require('../application/getDashboardStats');
const authenticateJWT = require('../infrastructure/authenticateJWT');

const router = express.Router();

router.get('/stats', authenticateJWT, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats.', details: err.message });
  }
});

module.exports = router;