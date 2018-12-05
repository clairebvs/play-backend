
exports.up = function(knex, Promise) {
  return knex.schema.table('playlists', function(t) {
    t.dropColumn('favorite_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('playlists', function(t) {
    t.integer('favorite_id').notNull();
  });
};
