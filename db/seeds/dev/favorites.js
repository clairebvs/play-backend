exports.seed = function(knex, Promise) {
  return knex('song_playlists').del()
    .then(() => knex('favorites').del())
    .then(() => knex('playlists').del())
    .then(() => {
      return Promise.all([
        knex('favorites').insert({
          name: 'Happy Birthday', artist_name: 'Becca and Claire', genre: 'Pop', song_rating: 100
        }, 'id')
        .then(favorite1 => {
          return knex('playlists').insert({
            playlist_name: 'Birthday Songs'
          }, 'id')
        .then(playlist1 => {
          return knex('song_playlists').insert({
            favorite_id: favorite1[0],
            playlist_id: playlist1[0]
          })
        })
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
