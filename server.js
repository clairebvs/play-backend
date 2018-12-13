const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play';

pry = require('pryjs');

app.get('/', (request, response) => {
  response.send('Hello, Play');
});

// ---------- FAVORITES ROUTES ----------- //

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

// ---------- PLAYLISTS ROUTES ----------- //

app.get('/api/v1/playlists', (request, response) => {

  database.raw(`SELECT playlists.id, AVG(CAST(favorites.song_rating AS int)) AS ranking, playlists.playlist_name, array_agg(json_build_object('id', favorites.id, 'name', favorites.name, 'artist_name', favorites.artist_name, 'genre', favorites.genre, 'song_rating', favorites.song_rating)) as songs
  FROM playlists
  INNER JOIN song_playlists ON playlists.id = song_playlists.playlist_id
  INNER JOIN favorites ON favorites.id = song_playlists.favorite_id
  GROUP BY playlists.id`)
    .then((playlists) => {
      response.status(200).json(playlists.rows);
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

app.get('/api/v1/playlists/:id/songs', (request, response) => {
  database.raw(`SELECT playlists.id, playlists.playlist_name, array_agg(json_build_object('id', favorites.id, 'name', favorites.name, 'artist_name', favorites.artist_name, 'genre', favorites.genre, 'song_rating', favorites.song_rating)) as songs
  FROM playlists
  INNER JOIN song_playlists ON playlists.id = song_playlists.playlist_id
  INNER JOIN favorites ON favorites.id = song_playlists.favorite_id
  WHERE playlists.id = ${request.params.id}
  GROUP BY playlists.id`)
    .then(favorites => {
        response.status(200).json(favorites.rows);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
  var playlistId = request.params.playlist_id
  var favoriteId = request.params.id
  var correspondingFavorite;
  var correspondingPlaylist;

  var playlist = database('playlists').where('id', playlistId).select()
   .then(playlists => {
     if(playlists.length) {
        correspondingPlaylist = playlists[0]['playlist_name'];
      } else {
        response.status(404).json({ error: `Could not find playlist with id ${playlistId}` });
      }
    });

  var favorite = database('favorites').where('id', favoriteId).select()
    .then(favorites => {
      if(favorites.length) {
        correspondingFavorite = favorites[0]['name'];
       } else {
         response.status(404).json({ error: `Could not find song with id ${favoriteId}` });
       }
    });

  return Promise.all([playlist, favorite])
  .then(() => {
    if (correspondingPlaylist && correspondingFavorite) {
      return database('song_playlists').insert([{ playlist_id: playlistId, favorite_id: favoriteId }])
     }
   })
     .then(() => {
        response.status(201).json({ message: `Successfully added ${correspondingFavorite} to ${correspondingPlaylist}` })
      })
    .catch((error) => {
      response.status(404).json({ error })
    })
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
    .catch((error) => {
      response.status(404).json({ error });
    });
});

app.delete('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
  const playlistId = request.params.playlist_id;
  const favoriteId = request.params.id;

  var playlistName;
  var favoriteName;

  database("playlists").where("id", playlistId).select()
  .then(playlists => {
    if(playlists.length) {
      playlistName = playlists[0]['playlist_name']
    } else {
      response.status(404).json({ error: `Could not find playlist with id ${playlistId}` });
    }
  });

  database("favorites").where("id", favoriteId).select()
  .then(favorites => {
    if(favorites.length) {
      favoriteName = favorites[0]['name']
    } else {
      response.status(404).json({ error: `Could not find favorite with id ${favoriteId}` });
    }
  });

  database("song_playlists")
    .where({
      playlist_id: playlistId,
      favorite_id: favoriteId
    })
    .del()
    .then(song_playlist => {
      if (song_playlist === 0) {
        response.status(404).json("Song not found on playlist");
      } else {
        response.status(200).json({ message: `Successfully removed ${favoriteName} from ${playlistName}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

const fetch = require("node-fetch");

app.post('/api/v1/search', (request, response) => {
  var artist = request.body.artist;
  var api_key = process.env.DB_MUSIC_KEY;
  var uri = `http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&page_size=5&page=1&apikey=${api_key}`

  var payload;

  fetch(`${uri}`)
    .then(response => response.json())
    .then(data => getMusic(data))
    .then(song_payload => {
      response.status(200).json(song_payload);
    })
    .catch(error => console.error({error}));

  const getMusic = (incoming_data) => {
    payload = [];
    trackList = incoming_data["message"]["body"]["track_list"]
    trackList.forEach(function(trackList) {
      var genre = "";
        if (trackList["track"]["primary_genres"]["music_genre_list"][0]){
          genre = trackList["track"]["primary_genres"]["music_genre_list"][0]["music_genre"]["music_genre_name"];
        } else {
          genre = 'No Genre Supplied';
        }

        payload.push(
          {
            "name": trackList["track"]["track_name"],
            "artist_name": trackList["track"]["artist_name"],
            "genre": genre,
            "song_rating": trackList["track"]["track_rating"]
          })
    })
    return payload
  };
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
