const db = require('../config/database');

module.exports = {
  async findByIssueId(issueId) {
    return db('status_history')
      .join('users', 'status_history.changed_by', 'users.id')
      .select(
        'status_history.id', 'status_history.old_status', 'status_history.new_status',
        'status_history.note', 'status_history.created_at',
        'users.first_name as changed_by_name', 'users.last_name as changed_by_last_name'
      )
      .where('status_history.issue_id', issueId)
      .orderBy('status_history.created_at', 'asc');
  },

  async create({ issue_id, old_status, new_status, changed_by, note }) {
    const [entry] = await db('status_history')
      .insert({ issue_id, old_status, new_status, changed_by, note })
      .returning('*');
    return entry;
  }
};
