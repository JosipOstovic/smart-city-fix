exports.up = function (knex) {
  return knex.schema.alterTable("issues", (table) => {
    table.dropForeign("category_id");
    table
      .foreign("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("issues", (table) => {
    table.dropForeign("category_id");
    table.foreign("category_id").references("id").inTable("categories");
  });
};
