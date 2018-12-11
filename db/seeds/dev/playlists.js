exports.seed = function(knex, Promise) {
  return knex('playlists').del()
    .then( () => {
      return Promise.all([
        knex('playlists').insert([
          {id: 1, playlist_name: 'Birthday Songs'},
          {id: 2, playlist_name: 'Party'}
        ])
      .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
