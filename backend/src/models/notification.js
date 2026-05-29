const db = require('../config/database');

module.exports = {
  async create({ user_id, issue_id, type, message }) {
    const [notification] = await db('notifications')
      .insert({ user_id, issue_id, type, message })
      .returning('*');
    return notification;
  },

  async findByUserId(userId, { unread_only = false } = {}) {
    let query = db('notifications')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(50);
    if (unread_only) query = query.where('is_read', false);
    return query;
  },

  async getUnreadCount(userId) {
    const result = await db('notifications')
      .where({ user_id: userId, is_read: false })
      .count('id as count')
      .first();
    return parseInt(result.count);
  },

  async markRead(id, userId) {
    await db('notifications').where({ id, user_id: userId }).update({ is_read: true });
  },

  async markAllRead(userId) {
    await db('notifications').where({ user_id: userId, is_read: false }).update({ is_read: true });
  }
};
