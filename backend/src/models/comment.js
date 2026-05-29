const db = require('../config/database');

module.exports = {
  async findByIssueId(issueId) {
    return db('comments')
      .join('users', 'comments.user_id', 'users.id')
      .select(
        'comments.id', 'comments.content', 'comments.created_at',
        'users.id as user_id', 'users.first_name', 'users.last_name'
      )
      .where('comments.issue_id', issueId)
      .orderBy('comments.created_at', 'asc');
  },

  async create({ issue_id, user_id, content }) {
    const [comment] = await db('comments')
      .insert({ issue_id, user_id, content })
      .returning('*');
    return comment;
  }
};
