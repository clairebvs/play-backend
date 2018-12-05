
exports.up = function(knex, Promise) {
  return knex.schema.table('favorites', function(t) {
    t.dropColumn('playlist_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('favorites', function(t) {
    t.integer('playlist_id').notNull();
  });
};
