exports.up = function(knex) {
  return knex.schema.createTable('comments', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('issue_id').notNullable().references('id').inTable('issues').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('issue_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
