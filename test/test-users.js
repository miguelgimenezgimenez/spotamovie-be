process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const server = require('../index');
let should = chai.should();

const UserSchema =require('../models/User');
const userController = require('../controllers/userController');
const Stub = require('./stub');
const mocks = require('./mocks');

chai.use(chaiHttp);
chai.use(sinonChai);

let stubUpdateUser, stubNewUser;

describe('Users:', () => {
  let request, response;
  beforeEach(() => {
    request = {};
    response = {};
  });

  afterEach(() => {
    response = {};
  });

  it('it should save a new user record to the database given valid data', (done) => {
    const newUser = {
      body: mocks.userDoc
    };
    const token = mocks.accessToken;

    userController.newUser(newUser, token)
    .then((user)=>{
      try {
        user.should.be.a('object');
        user.should.have.property('_id');
        user.should.have.property('name');
        user.should.have.property('email');
        user.should.have.property('spotifyId');
        user.should.have.property('userToken');
        user.should.have.property('loginDate');
        user.should.have.property('firstLogin');
        user['name'].should.be.eq(newUser.body.display_name);
        user['email'].should.be.eq(newUser.body.email);
        user['spotifyId'].should.be.eq(newUser.body.id);
        user['firstLogin'].should.be.true;
        done();
      } catch (err) {
        done(err);
      } finally {
        UserSchema.remove({
          _id: user._id
        }, (err, removed) => {
          if (err) console.log('error during remove', err);
        });
      }
    });
  });

  it('it should produce an error when missing Spotify ID', (done) => {
    const newUser = mocks.userDocInvalid1;

    const user = new UserSchema(newUser);

    user.validate(error => {
      error.errors.spotifyId.should.exist;
      done();
    });
  });

  it('it should produce an error when missing user token', (done) => {
    const newUser = mocks.userDocInvalid2;

    const user = new UserSchema(newUser);

    user.validate(error => {
      error.errors.userToken.should.exist;
      done();
    });
  });

  it('it should produce an error when missing loginDate', (done) => {
    const newUser = mocks.userDocInvalid3;

    const user = new UserSchema(newUser);

    user.validate(error => {
      error.errors.loginDate.should.exist;
      done();
    });
  });

});
