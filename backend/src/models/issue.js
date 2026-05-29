const db = require('../config/database');

module.exports = {
  async findAll({ category_id, status, date_from, date_to, bounds, page = 1, limit = 50 }) {
    let query = db('issues')
      .join('categories', 'issues.category_id', 'categories.id')
      .select(
        'issues.id', 'issues.title', 'issues.status',
        'issues.latitude', 'issues.longitude', 'issues.address',
        'issues.photo_urls', 'issues.created_at',
        'categories.id as category_id', 'categories.name as category_name', 'categories.icon as category_icon'
      )
      .orderBy('issues.created_at', 'desc');

    if (category_id) query = query.where('issues.category_id', category_id);
    if (status) query = query.where('issues.status', status);
    if (date_from) query = query.where('issues.created_at', '>=', date_from);
    if (date_to) query = query.where('issues.created_at', '<=', date_to);
    if (bounds) {
      const [sw_lat, sw_lng, ne_lat, ne_lng] = bounds.split(',').map(Number);
      query = query.whereBetween('issues.latitude', [sw_lat, ne_lat])
                   .whereBetween('issues.longitude', [sw_lng, ne_lng]);
    }

    const offset = (page - 1) * limit;
    const countQuery = query.clone().clearSelect().clearOrder().count('issues.id as total').first();
    const [{ total }] = await Promise.all([countQuery]);
    const issues = await query.offset(offset).limit(limit);

    return {
      issues: issues.map(i => ({
        id: i.id, title: i.title, status: i.status,
        latitude: i.latitude, longitude: i.longitude, address: i.address,
        photo_urls: i.photo_urls || [], created_at: i.created_at,
        category: { id: i.category_id, name: i.category_name, icon: i.category_icon }
      })),
      total: parseInt(total),
      page: parseInt(page),
      pages: Math.ceil(parseInt(total) / limit)
    };
  },

  async findById(id) {
    const issue = await db('issues')
      .join('categories', 'issues.category_id', 'categories.id')
      .join('users', 'issues.user_id', 'users.id')
      .select(
        'issues.*',
        'categories.name as category_name', 'categories.icon as category_icon',
        'users.id as user_id', 'users.first_name', 'users.last_name'
      )
      .where('issues.id', id)
      .first();

    if (!issue) return null;

    const status_history = await db('status_history')
      .join('users', 'status_history.changed_by', 'users.id')
      .select('status_history.*', 'users.first_name as changed_by_name')
      .where('status_history.issue_id', id)
      .orderBy('status_history.created_at', 'asc');

    const comments = await db('comments')
      .join('users', 'comments.user_id', 'users.id')
      .select('comments.*', 'users.first_name', 'users.last_name')
      .where('comments.issue_id', id)
      .orderBy('comments.created_at', 'asc');

    return {
      id: issue.id, title: issue.title, description: issue.description,
      status: issue.status, latitude: issue.latitude, longitude: issue.longitude,
      address: issue.address, photo_urls: issue.photo_urls || [],
      created_at: issue.created_at, updated_at: issue.updated_at,
      category: { id: issue.category_id, name: issue.category_name, icon: issue.category_icon },
      user: { id: issue.user_id, first_name: issue.first_name, last_name: issue.last_name },
      status_history: status_history.map(h => ({
        old_status: h.old_status, new_status: h.new_status,
        changed_by_name: h.changed_by_name, note: h.note, created_at: h.created_at
      })),
      comments: comments.map(c => ({
        id: c.id, content: c.content, created_at: c.created_at,
        user: { id: c.user_id, first_name: c.first_name, last_name: c.last_name }
      }))
    };
  },

  async getPublicStats() {
    const stats = await db('issues')
      .select(db.raw("count(*) as total"))
      .select(db.raw("count(*) filter (where status = 'resolved') as resolved"))
      .select(db.raw("count(*) filter (where status in ('reported', 'in_progress')) as active"))
      .first();
    return { total: parseInt(stats.total), resolved: parseInt(stats.resolved), active: parseInt(stats.active) };
  }
};
