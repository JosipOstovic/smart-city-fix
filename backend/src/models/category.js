const db = require('../config/database');

module.exports = {
  async findAll() {
    return db('categories').select('id', 'name', 'icon').orderBy('id');
  }
};
