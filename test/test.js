process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');

let chai = require('chai');
let chaiHttp = require('chai-http');
const server = 'https://private-77bd5f-spotamovie.apiary-mock.com';
let should = chai.should();

chai.use(chaiHttp);

describe('Movies', () => {

  // Test Login
  describe('/login POST user', () => {
     it('it should allow user to login using Spotify credentials', (done) => {
       chai.request(server)
        .post('/login')
        .field('code', 'auth_code_3838383838383')
        .field('redirect_uri','spotamovie://callback')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('userToken');
        done();
      });
    });
  });

  describe('/movies/{movie_id}/like POST like', () => {
     it('it should allow posting an item liked by a particular user', (done) => {
       const movie_id = 'TESTxxxxxxxx';
       chai.request(server)
        .post(`/movies/${movie_id}/like`)
        .field('token', '2j3j3k3kl2lk34j2lsois')
        .end((err, res) => {
          res.should.have.status(201);
        done();
      });
    });
  });

});
