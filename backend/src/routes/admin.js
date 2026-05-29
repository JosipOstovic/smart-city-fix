const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const validate = require('../middleware/validate');
const adminService = require('../services/adminService');

router.use(authenticate, requireRole('admin'));

router.get('/issues', async (req, res, next) => {
  try {
    const result = await adminService.listAll(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

router.patch('/issues/:id/status',
  [
    body('status').isIn(['reported', 'in_progress', 'resolved', 'rejected']),
    body('note').optional().isLength({ max: 500 })
  ],
  validate,
  async (req, res, next) => {
    try {
      const result = await adminService.changeStatus(req.params.id, req.body, req.user.id);
      res.json(result);
    } catch (err) { next(err); }
  }
);

router.delete('/issues/:id', async (req, res, next) => {
  try {
    await adminService.deleteIssue(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});


module.exports = router;
