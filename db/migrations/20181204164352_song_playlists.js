
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('song_playlists', function(table) {
      table.integer('playlist_id').unsigned()
      table.foreign('playlist_id')
        .references('playlists.id')
        .onDelete('CASCADE');
      table.integer('favorite_id').unsigned()
      table.foreign('favorite_id')
        .references('favorites.id')
        .onDelete('CASCADE');

      table.timestamps(true, true);
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('song_playlists')
  ]);
};
