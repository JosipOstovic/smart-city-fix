const db = require('../config/database');
const StatusHistory = require('../models/statusHistory');
const Notification = require('../models/notification');

module.exports = {
  async listAll({ search, category_id, status, page = 1, limit = 20 }) {
    let query = db('issues')
      .join('categories', 'issues.category_id', 'categories.id')
      .join('users', 'issues.user_id', 'users.id')
      .select(
        'issues.id', 'issues.title', 'issues.status', 'issues.created_at',
        'categories.name as category_name', 'categories.icon as category_icon',
        'users.first_name', 'users.last_name', 'users.email'
      )
      .orderBy('issues.created_at', 'desc');

    if (search) query = query.where('issues.title', 'ilike', `%${search}%`);
    if (category_id) query = query.where('issues.category_id', category_id);
    if (status) query = query.where('issues.status', status);

    const countResult = await query.clone().clearSelect().clearOrder().count('issues.id as total').first();
    const total = parseInt(countResult.total);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const issues = await query.offset(offset).limit(parseInt(limit));

    return {
      issues: issues.map(i => ({
        id: i.id, title: i.title, status: i.status, created_at: i.created_at,
        category: { name: i.category_name, icon: i.category_icon },
        user: { first_name: i.first_name, last_name: i.last_name, email: i.email }
      })),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    };
  },

  async changeStatus(issueId, { status, note }, adminId) {
    const issue = await db('issues').where('id', issueId).first();
    if (!issue) throw Object.assign(new Error('Issue not found'), { status: 404 });

    const oldStatus = issue.status;
    await db('issues').where('id', issueId).update({ status, updated_at: new Date() });

    const historyEntry = await StatusHistory.create({
      issue_id: issueId,
      old_status: oldStatus,
      new_status: status,
      changed_by: adminId,
      note: note || null
    });

    // Create notification for issue owner
    const statusLabels = { reported: 'Prijavljeno', in_progress: 'U tijeku', resolved: 'Riješeno', rejected: 'Odbijeno' };
    await Notification.create({
      user_id: issue.user_id,
      issue_id: issueId,
      type: 'status_change',
      message: `Status vašeg problema "${issue.title}" promijenjen u: ${statusLabels[status]}`
    });

    return { issue: { id: issueId, status, updated_at: new Date() }, history_entry: historyEntry };
  },

  async deleteIssue(issueId) {
    const issue = await db('issues').where('id', issueId).first();
    if (!issue) throw Object.assign(new Error('Issue not found'), { status: 404 });
    await db('issues').where('id', issueId).del();
  }
};
