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


  describe("GET /api/v1/favorites", () => {
    it("should return all of the favorites", done => {
      chai.request(server)
      .get("/api/v1/favorites")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
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
      database('favorites').select('*').then(data => resolve(data))
      function resolve(favorite) {
        chai.request(server)
        .get(`/api/v1/favorites/${favorite[0].id}`)
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
      };
    });
  });

  describe("GET /api/v1/playlists", () => {
    it("should return all of the playlists", done => {
      chai.request(server)
      .get("/api/v1/playlists")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('playlist_name');
        response.body[0].playlist_name.should.equal('Birthday Songs');
        done();
      });
    })
  });

  describe("GET /api/v1/playlists/:id", () => {
    it("should return one playlist by id", done => {
      database('playlists').select('*').then(data => resolve(data))
      function resolve(playlist) {
        chai.request(server)
        .get(`/api/v1/playlists/${playlist[0].id}`)
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
      };
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
});
