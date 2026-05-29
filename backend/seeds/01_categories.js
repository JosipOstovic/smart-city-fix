exports.seed = async function(knex) {
  await knex('categories').del();

  await knex('categories').insert([
    { name: 'Rupa na cesti', icon: '🕳️' },
    { name: 'Javna rasvjeta', icon: '💡' },
    { name: 'Smeće', icon: '🗑️' },
    { name: 'Prometni znak', icon: '🚧' },
    { name: 'Vandalizam', icon: '🎨' },
    { name: 'Zelene površine', icon: '🌳' },
    { name: 'Ostalo', icon: '📋' },
  ]);
};
