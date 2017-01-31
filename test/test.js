process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const User = require('../models/User');
const Buffer = require('buffer/').Buffer;
const nconf = require('../config/nconf');

let chai = require('chai');
let chaiHttp = require('chai-http');
const server = 'https://private-77bd5f-spotamovie.apiary-mock.com';
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

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
});
