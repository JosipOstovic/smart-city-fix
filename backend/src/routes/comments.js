const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Comment = require('../models/comment');
const db = require('../config/database');

router.post('/issues/:issueId/comments',
  authenticate,
  [body('content').notEmpty().isLength({ max: 1000 })],
  validate,
  async (req, res, next) => {
    try {
      const { issueId } = req.params;
      const issue = await db('issues').where('id', issueId).first();
      if (!issue) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Issue not found' } });

      const comment = await Comment.create({
        issue_id: issueId,
        user_id: req.user.id,
        content: req.body.content
      });

      const author = await db('users')
        .select('id', 'first_name', 'last_name')
        .where('id', req.user.id)
        .first();

      res.status(201).json({
        comment: {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user: {
            id: author.id,
            first_name: author.first_name,
            last_name: author.last_name,
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
