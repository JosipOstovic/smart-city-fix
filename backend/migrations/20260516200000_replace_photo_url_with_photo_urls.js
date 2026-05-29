exports.up = async function(knex) {
  await knex.schema.alterTable('issues', table => {
    table.jsonb('photo_urls').notNullable().defaultTo('[]');
  });

  await knex.raw(`
    UPDATE issues
    SET photo_urls = jsonb_build_array(photo_url)
    WHERE photo_url IS NOT NULL AND photo_url <> ''
  `);

  await knex.schema.alterTable('issues', table => {
    table.dropColumn('photo_url');
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('issues', table => {
    table.string('photo_url', 500);
  });

  await knex.raw(`
    UPDATE issues
    SET photo_url = photo_urls->>0
    WHERE jsonb_array_length(photo_urls) > 0
  `);

  await knex.schema.alterTable('issues', table => {
    table.dropColumn('photo_urls');
  });
};
