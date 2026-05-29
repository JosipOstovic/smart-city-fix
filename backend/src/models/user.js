const db = require('../config/database');

module.exports = {
  async findByEmail(email) {
    return db('users').where({ email }).first();
  },

  async findById(id) {
    return db('users').where({ id }).first();
  },

  async create({ first_name, last_name, email, password_hash, role = 'user' }) {
    const [user] = await db('users')
      .insert({ first_name, last_name, email, password_hash, role })
      .returning(['id', 'first_name', 'last_name', 'email', 'role', 'created_at']);
    return user;
  },
};
