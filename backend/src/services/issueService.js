const Issue = require('../models/issue');
const db = require('../config/database');
const { reverseGeocode } = require('../utils/geocoding');

module.exports = {
  async create({ title, description, category_id, latitude, longitude, photo_urls, user_id }) {
    const address = await reverseGeocode(latitude, longitude);

    const [issue] = await db('issues')
      .insert({
        title, description, category_id, status: 'reported',
        latitude, longitude, address,
        photo_urls: JSON.stringify(photo_urls),
        user_id
      })
      .returning('*');

    return issue;
  },

  async update(id, userId, updates) {
    // Check ownership and status
    const issue = await db('issues').where({ id }).first();
    if (!issue) throw Object.assign(new Error('Issue not found'), { status: 404 });
    if (issue.user_id !== userId) throw Object.assign(new Error('Not authorized'), { status: 403 });
    if (issue.status !== 'reported') throw Object.assign(new Error('Cannot edit issue after admin review'), { status: 403 });

    // If location changed, re-geocode
    if (updates.latitude && updates.longitude) {
      updates.address = await reverseGeocode(updates.latitude, updates.longitude);
    }

    updates.updated_at = new Date();
    const [updated] = await db('issues').where({ id }).update(updates).returning('*');
    return updated;
  },

  async delete(id) {
    const issue = await db('issues').where({ id }).first();
    if (!issue) throw Object.assign(new Error('Issue not found'), { status: 404 });
    await db('issues').where({ id }).del();
  },

  // Delegate to model for reads
  findAll: Issue.findAll,
  findById: Issue.findById,
  getPublicStats: Issue.getPublicStats,
};
