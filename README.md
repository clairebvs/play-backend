# Play (Back End)

Play is a full-stack JS / Express music-themed CRUD application. Play is a partner project for Module 4 Back End students at Turing School of Software & Design. The project introduces students to Express database interactions, Node.js, and HTTP testing in these frameworks.
 
 Looking for the front end? Visit [play-frontend](https://github.com/BeccaHyland/play-frontend).
 
 Play interfaces with an external API to populate songs by a searched artist, then allows the user to track favorite songs and add favorites to playlists.
 
 ## How to Use
 *coming soon!*
 
 ## Endpoints
 This API supplies the following json endpoints:
 
 GET `/api/v1/favorites`
 * returns all favorited songs in the database
 
 GET `/api/v1/favorites/INSERT ID HERE`
 * returns one favorited song by its id
 
 GET `/api/v1/playlists`
 * returns all playlists in the database (pending return of all associated songs)
 
 GET `/api/v1/playlist/INSERT ID HERE`
 * returns one playlist by its id (pending return of all associated songs)
 
 ## Backend Built With
 
 * Node.js
 * Express
 * Knex
 * Postgresql
 
 ## Tested with 
 * Mocha
 * Chai
