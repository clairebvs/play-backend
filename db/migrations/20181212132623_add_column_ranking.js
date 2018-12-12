exports.up = function(knex, Promise) {
    return knex.schema.table('playlists', function(t) {
        t.integer('ranking').notNull().defaultTo(0);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('playlists', function(t) {
        t.dropColumn('ranking');
    });
};
