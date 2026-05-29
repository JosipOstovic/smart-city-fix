exports.up = function(knex) {
  return knex.schema.createTable('notifications', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('issue_id').notNullable().references('id').inTable('issues').onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.string('message', 300).notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['user_id', 'is_read']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};
