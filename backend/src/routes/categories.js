const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
