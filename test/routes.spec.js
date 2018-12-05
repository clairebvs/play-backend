// pulling in packages / give us access to those library
const chai = require('chai');
// equivalent of capybara shoulda-matchers
const should = chai.should();
// call chai-http
const chaiHttp = require('chai-http');
// pulling our own server file
const server = require('../server');

chai.use(chaiHttp);

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
    chai.request(server)
    .get("/api/v1/favorites/1")
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
      response.body[0].id.should.equal(1);
      response.body[0].name.should.equal('Happy Birthday');
      response.body[0].artist_name.should.equal('Becca and Claire');
      response.body[0].genre.should.equal('Pop');
      response.body[0].song_rating.should.equal('100');
      done();
    });
  })
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
    chai.request(server)
    .get("/api/v1/playlists/1")
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('id');
      response.body[0].id.should.equal(1);
      response.body[0].should.have.property('playlist_name');
      response.body[0].playlist_name.should.equal('Birthday Songs');
      done();
    });
  })
});


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
});
