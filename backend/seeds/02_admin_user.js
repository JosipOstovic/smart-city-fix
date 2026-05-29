const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('users').del();

  await knex('users').insert([
    {
      first_name: 'Admin',
      last_name: 'SmartCityFix',
      email: 'admin@smartcityfix.hr',
      password_hash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
    },
  ]);
};
