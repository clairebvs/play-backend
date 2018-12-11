const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe("My API routes", () => {
  before((done) => {
    database.migrate.latest()
    .then( () => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then( () => done())
    .catch(error => {
      throw error;
    });
  });

  // ---------- FAVORITES ENDPOINTS ----------- //

  describe("GET /api/v1/favorites", () => {
    it("should return all of the favorites", done => {
      chai.request(server)
      .get("/api/v1/favorites")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(4);
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('artist_name');
        response.body[0].should.have.property('genre');
        response.body[0].should.have.property('song_rating');
        response.body[0].name.should.equal('Happy Birthday');
        response.body[0].artist_name.should.equal('Becca and Claire');
        response.body[0].genre.should.equal('Pop');
        response.body[0].song_rating.should.equal('100');
        done();
      });
    })
  });

  describe("GET /api/v1/favorites/:id", () => {
    it("should return a favorite by id", done => {
      chai.request(server)
      .get(`/api/v1/favorites/1`)
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('artist_name');
        response.body[0].should.have.property('genre');
        response.body[0].should.have.property('song_rating');
        response.body[0].name.should.equal('Happy Birthday');
        response.body[0].artist_name.should.equal('Becca and Claire');
        response.body[0].genre.should.equal('Pop');
        response.body[0].song_rating.should.equal('100');
        done();
      });
    });
  });

  describe("POST /api/v1/favorites", () => {
    it("should add a new favorite song to the database", done => {
      chai.request(server)
      .post("/api/v1/favorites")
      .send({
        name: "Feliz Cumpleanos",
        artist_name: "Becca",
        genre: "Pop",
        song_rating: 100
      })
      .end((err, response) => {
        should.exist(response.body)
        response.should.have.status(201);
        response.should.be.json;
        response.body["songs"].should.be.a('object');
        response.body["songs"].should.have.property('id');
        response.body["songs"].should.have.property('name');
        response.body["songs"].should.have.property('artist_name');
        response.body["songs"].should.have.property('genre');
        response.body["songs"].should.have.property('song_rating');
        response.body["songs"].name.should.equal('Feliz Cumpleanos');
        response.body["songs"].artist_name.should.equal('Becca');
        response.body["songs"].genre.should.equal('Pop');
        response.body["songs"].song_rating.should.equal('100');
        done();
      });
    });
  });

  describe("DELETE /api/v1/favorites/:id", () => {
    it("should delete a favorite by id", done => {
      chai.request(server)
      .delete("/api/v1/favorites/1")
      .end((err, response) => {
        response.should.have.status(204);
        response.body.should.be.a('object');
        done();
      });
    })
  });

  // ---------- PLAYLISTS ENDPOINTS ----------- //

  describe("GET /api/v1/playlists", () => {
    it("should return all of the playlists and the songs associated", done => {
      chai.request(server)
      .get("/api/v1/playlists")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('playlist_name');
        response.body[0].should.have.property('songs');
        response.body[0].playlist_name.should.equal('Birthday Songs');
        response.body[0].songs[0].name.should.equal('Happy Birthday');
        response.body[0].songs[0].artist_name.should.equal('Becca and Claire');
        response.body[0].songs[0].genre.should.equal('Pop');
        response.body[0].songs[0].song_rating.should.equal('100');
        done();
      });
    })
  });

  describe("GET /api/v1/playlists/:id", () => {
    it("should return one playlist by id", done => {
      chai.request(server)
      .get(`/api/v1/playlists/1`)
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('playlist_name');
        response.body[0].playlist_name.should.equal('Birthday Songs');
        done();
      });
    });
  });

  describe("GET /api/v1/playlists/:id/songs", () => {
    it("should return one playlist by id and the songs associated", done => {
      chai.request(server)
      .get(`/api/v1/playlists/1/songs`)
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('playlist_name');
        response.body[0].should.have.property('songs');
        response.body[0].playlist_name.should.equal('Birthday Songs');
        response.body[0].songs[0].name.should.equal('Happy Birthday');
        response.body[0].songs[0].artist_name.should.equal('Becca and Claire');
        response.body[0].songs[0].genre.should.equal('Pop');
        response.body[0].songs[0].song_rating.should.equal('100');
        done();
      });
    });
  });

  describe("POST /api/v1/playlists/:playlist_id/songs/:id", () => {
    it("should add a song :id with the playlist_id to the song_playlist table", done => {
      chai.request(server)
      .post(`/api/v1/playlists/1/songs/4`)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.property('message')
        response.body.message.should.equal('Successfully added Joyeux Anniversaire to Birthday Songs')
        done();
      })
    })

    it('should return a 400 error if the playlist is not found', done => {
        chai.request(server)
          .post('/api/v1/playlists/10/songs/1')
          .end((error, response) => {
            response.should.have.status(404)
            done()
          })
      })

    it('should return a 400 error if the song is not found', done => {
        chai.request(server)
          .post('/api/v1/playlists/1/songs/12')
          .end((error, response) => {
            response.should.have.status(404)
            done()
          })
      })
  });

  describe("DELETE /api/v1/playlists/:playlist_id/songs/:id", () => {
    it("should delete a playlist by id", done => {
      chai.request(server)
      .delete("/api/v1/playlists/1/songs/2")
      .end((err, response) => {
        response.should.have.status(204);
        console.log("BAHAHHAHAHAHAH");
        response.body.message.should.equal('Successfully removed Feliz Cumpleanos from Birthday Songs')
        done();
      });
    })

    it('should return a 400 error if the playlist is not found', done => {
        chai.request(server)
          .post('/api/v1/playlists/1/songs/20')
          .end((error, response) => {
            response.should.have.status(404)
            done()
          })
      })

    it('should return a 400 error if the song is not found', done => {
        chai.request(server)
          .post('/api/v1/playlists/20/songs/3')
          .end((error, response) => {
            response.should.have.status(404)
            done()
          })
      })
  });

});
