exports.up = function(knex) {
  return knex.schema.createTable('issues', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('title', 200).notNullable();
    table.text('description').notNullable();
    table.integer('category_id').unsigned().notNullable().references('id').inTable('categories');
    table.enum('status', ['reported', 'in_progress', 'resolved', 'rejected']).notNullable().defaultTo('reported');
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.string('address', 300);
    table.string('photo_url', 500).notNullable();
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('category_id');
    table.index('status');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('issues');
};
