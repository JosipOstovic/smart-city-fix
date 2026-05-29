const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Issue = require('../models/issue');
const issueService = require('../services/issueService');
const { authenticate, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// GET /api/issues/stats/public - must be before /:id
router.get('/stats/public', optionalAuth, async (req, res, next) => {
  try {
    const stats = await Issue.getPublicStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// GET /api/issues
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category_id, status, date_from, date_to, bounds, page, limit } = req.query;
    const result = await Issue.findAll({ category_id, status, date_from, date_to, bounds, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/issues/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Issue not found' } });
    }
    res.json({ issue });
  } catch (err) {
    next(err);
  }
});

// POST /api/issues
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
    body('description').notEmpty().withMessage('Description is required').isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),
    body('category_id').isInt().withMessage('Category is required'),
    body('latitude').isFloat().withMessage('Latitude is required'),
    body('longitude').isFloat().withMessage('Longitude is required'),
    body('photo_urls').isArray({ min: 1, max: 5 }).withMessage('Between 1 and 5 photos required'),
    body('photo_urls.*').isURL().withMessage('Each photo must be a valid URL'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, category_id, latitude, longitude, photo_urls } = req.body;
      const issue = await issueService.create({
        title, description, category_id, latitude, longitude, photo_urls,
        user_id: req.user.id,
      });
      res.status(201).json({ issue });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/issues/:id
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),
    body('category_id').optional().isInt().withMessage('Category must be a valid integer'),
    body('latitude').optional().isFloat().withMessage('Latitude must be a valid number'),
    body('longitude').optional().isFloat().withMessage('Longitude must be a valid number'),
    body('photo_urls').optional().isArray({ min: 1, max: 5 }).withMessage('Between 1 and 5 photos required'),
    body('photo_urls.*').optional().isURL().withMessage('Each photo must be a valid URL'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, category_id, latitude, longitude, photo_urls } = req.body;
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (category_id !== undefined) updates.category_id = category_id;
      if (latitude !== undefined) updates.latitude = latitude;
      if (longitude !== undefined) updates.longitude = longitude;
      if (photo_urls !== undefined) updates.photo_urls = JSON.stringify(photo_urls);

      const issue = await issueService.update(req.params.id, req.user.id, updates);
      res.json({ issue });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ error: { code: err.status === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: err.message } });
      }
      next(err);
    }
  }
);

module.exports = router;
