const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const statisticsService = require('../services/statisticsService');

router.get('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const stats = await statisticsService.getStatistics();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
