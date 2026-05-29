exports.up = function(knex) {
  return knex.schema.createTable('categories', table => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.string('icon', 50).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('categories');
};
