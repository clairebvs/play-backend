exports.seed = function(knex, Promise) {
  return knex('song_playlists').del()
    .then(() => {
      return Promise.all([
        knex('song_playlists').insert([
          {favorite_id: 2, playlist_id: 1},
          {favorite_id: 1, playlist_id: 1},
          {favorite_id: 3, playlist_id: 2}
        ])
      .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
