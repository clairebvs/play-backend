exports.seed = function(knex, Promise) {
  return knex('favorites').del()
    .then(() => {
      return Promise.all([
        knex('favorites').insert([
          {id: 1, name: 'Happy Birthday', artist_name: 'Becca and Claire', genre: 'Pop', song_rating: '100'},
          {id: 2, name: 'Feliz Cumpleanos', artist_name: 'Becca', genre: 'Pop', song_rating: '80'},
          {id: 3, name: 'We are the Champions', artist_name: 'Queen', genre: 'Rock', song_rating: '50'},
          {id: 4, name: 'Joyeux Anniversaire', artist_name: 'Claire', genre: 'Pop', song_rating: '40'},
        ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
