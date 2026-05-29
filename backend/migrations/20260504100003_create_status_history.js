exports.up = function(knex) {
  return knex.schema.createTable('status_history', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('issue_id').notNullable().references('id').inTable('issues').onDelete('CASCADE');
    table.enum('old_status', ['reported', 'in_progress', 'resolved', 'rejected']).notNullable();
    table.enum('new_status', ['reported', 'in_progress', 'resolved', 'rejected']).notNullable();
    table.uuid('changed_by').notNullable().references('id').inTable('users');
    table.text('note').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('issue_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('status_history');
};
