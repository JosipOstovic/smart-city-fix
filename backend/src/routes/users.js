const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.get('/me/issues', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    let query = db('issues')
      .join('categories', 'issues.category_id', 'categories.id')
      .select(
        'issues.id', 'issues.title', 'issues.status', 'issues.created_at',
        'categories.name as category_name', 'categories.icon as category_icon'
      )
      .where('issues.user_id', userId)
      .orderBy('issues.created_at', 'desc');

    if (status) query = query.where('issues.status', status);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const issues = await query.offset(offset).limit(parseInt(limit));

    const statsResult = await db('issues')
      .where('user_id', userId)
      .select(
        db.raw("count(*) as total"),
        db.raw("count(*) filter (where status = 'reported') as reported"),
        db.raw("count(*) filter (where status = 'in_progress') as in_progress"),
        db.raw("count(*) filter (where status = 'resolved') as resolved")
      )
      .first();

    res.json({
      issues: issues.map(i => ({
        id: i.id, title: i.title, status: i.status, created_at: i.created_at,
        category: { name: i.category_name, icon: i.category_icon }
      })),
      stats: {
        total: parseInt(statsResult.total),
        reported: parseInt(statsResult.reported),
        in_progress: parseInt(statsResult.in_progress),
        resolved: parseInt(statsResult.resolved)
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
