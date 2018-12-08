const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play';


app.get('/', (request, response) => {
  response.send('Hello, Play');
});

// ----- FAVORITES ENDPOINTS ----- //

app.get('/api/v1/favorites', (request, response) => {
  database('favorites').select()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).select()
    .then(favorites => {
      if (favorites.length) {
        console.log(favorites.length);
        response.status(200).json(favorites);
      } else {
        response.status(404).json({
          error: `Could not find favorite with id ${request.params.id}`
        });
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/favorites', (request, response) => {
  const favorite = request.body;

  for (let requiredParameter of ['name', 'artist_name', 'genre', 'song_rating']) {
    if (!favorite[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { 'name': <String>, artist_name: <String>, 'genre': <String>, 'song_rating': <Integer> } You're missing a "${requiredParameter}" property.`});
    }
  }

  database('favorites').insert(favorite, '*')
  .then(favorite => {
    response.status(201).json({"songs": favorite[0] });
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).del()
    .then(() => {
      return response.status(204).send({ message: `Song ${request.params.id} successfully removed from favorites`})
    })
    .catch((error) => {
      response.status(404).json({ error });
    });
});

// ----- PLAYLISTS ENDPOINTS ----- //

app.get('/api/v1/playlists', (request, response) => {
  database('playlists').select()
    .then((playlists) => {
      response.status(200).json(playlists);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/playlists/:id', (request, response) => {
  database('playlists').where('id', request.params.id).select()
    .then(playlists => {
      if (playlists.length) {
        response.status(200).json(playlists);
      } else {
        response.status(404).json({
          error: `Could not find playlist with id ${request.params.id}`
        });
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
