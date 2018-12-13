# Play (Back End)

Play is a full-stack JS / Express music-themed CRUD application and a partner project for Module 4 Back End students at Turing School of Software & Design. The project introduces students to Express with a Postgres database, Node.js, and HTTP testing in these frameworks.
 
Looking for our front end? Visit [play-frontend](https://github.com/BeccaHyland/play-frontend).
 
Play interfaces with the external API [Musixmatch](https://developer.musixmatch.com/)  to populate songs by a searched artist, then allows the user to track favorite songs and add favorites to playlists.
 
 ## Setup
1. Clone this repository
2. Inside the repo and on the command line, run the command `npm install` 
3. Next, to create the database, run `psql` and `CREATE DATABASE playbackend`, then exit postgresql with `\q`
4. Enter the following at the command line:
`npm init --yes`
`npm install knex -g`
`npm install knex --save`
`npm install pg --save`
`npm start`
5. Migrate your database with the command `knex migrate:latest`
6. You are ready to query Play for data! In your browser or an HTTP client like Postman, navigate to `localhost:3000`
7. Append any the endpoints below to your request to view results
 * For POST favorites you will need Postman to send the body (see below)
 * Remember: if using Postman, set two Headers as follows: Keys: Content-Type, Accept , Values: application/json (for both)
 
 ## Endpoints
 This API supplies the following json endpoints:
 
 GET `/api/v1/favorites`
 * returns all favorited songs in the database
 
 GET `/api/v1/favorites/INSERT ID HERE`
 * returns one favorited song by its id
 
 POST `/api/v1/favorite1`
 * adds a song to the database as a favorite
 * body accepts JSON with the following attributes:
 `{ name: String, artist_name: String, genre: String, song_rating: Integer out of 100 }`
 
 DELETE `/api/v1/favorites/INSERT id of favorite song`
 * deletes song from favorites list, no longer present in database
 
 GET `/api/v1/playlists`
 * returns all playlists in the database with associated songs for each playlist
 
 GET `/api/v1/playlist/INSERT ID HERE`
 * returns one playlist by its id with associated songs for that playlist

 POST `/api/v1/playlists/INSERT playlist id here/songs/INSERT song id here`
 * adds a favorite song to a playlist

DELETE `/api/v1/playlists/INSERT playlist id here/songs/INSERT song id here`
* removes favorite song from a playlist
* playlist is not deleted from database or from any other playlists

 ## Backend Built With
 * Node.js
 * Express
 * Knex
 * Postgresql
 
 ## Tested with 
 * Mocha
 * Chai
