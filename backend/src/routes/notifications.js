const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Notification = require('../models/notification');

router.use(authenticate);

// GET / - get user's notifications
router.get('/', async (req, res, next) => {
  try {
    const { unread_only } = req.query;
    const notifications = await Notification.findByUserId(req.user.id, { unread_only: unread_only === 'true' });
    const unread_count = await Notification.getUnreadCount(req.user.id);
    res.json({ notifications, unread_count });
  } catch (err) { next(err); }
});

// PATCH /:id/read - mark single notification as read
router.patch('/:id/read', async (req, res, next) => {
  try {
    await Notification.markRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// PATCH /read-all - mark all as read
router.patch('/read-all', async (req, res, next) => {
  try {
    await Notification.markAllRead(req.user.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
