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
      body: mocks.userInfo
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
        UserSchema.findOneAndRemove({
          _id: user._id
        }, (err, removed) => {
          if (err) throw err;
        });
      }
    });
  });

  it('it should retrieve a user document given a valid user token', (done) => {
    request.headers = mocks.authHeader;

    const newUser = new UserSchema(mocks.userObj);

    newUser.save((err) => {
      if (err) throw err;
      userController.me(request, response);
    });

    response.send = (user) => {
      try {
        response.status.should.be.eq(200);
        user.should.be.a('object');
        user.should.have.property('_id');
        user.should.have.property('name');
        user.name.should.eq(mocks.userObj.name);
        user.should.have.property('spotifyId');
        user.spotifyId.should.eq(mocks.userObj.spotifyId);
        user.should.have.property('userToken');
        user.userToken.should.eq(mocks.userObj.userToken);
        done();
      } catch (err) {
        done(err);
      } finally {
        UserSchema.findOneAndRemove({
          _id: user._id
        }, (err, removed) => {
          if (err) throw err;
        });
      }
    };

  });

  it('it should send an error when missing authorization header in request', (done) => {
    request.headers = mocks.authHeaderMissing;

    response.sendStatus = (status) => {
      try {
        status.should.be.eq(400);
        done();
      } catch (err) {
        done(err);
      }
    };

    userController.me(request, response);

  });

  it('it should produce an error when missing Spotify ID', (done) => {
    const newUser = mocks.userInfoInvalid1;

    const user = new UserSchema(newUser);

    user.validate(error => {
      error.errors.spotifyId.should.exist;
      done();
    });
  });

  it('it should produce an error when missing user token', (done) => {
    const newUser = mocks.userInfoInvalid2;

    const user = new UserSchema(newUser);

    user.validate(error => {
      error.errors.userToken.should.exist;
      done();
    });
  });

  it('it should produce an error when missing loginDate', (done) => {
    const newUser = mocks.userInfoInvalid3;

    const user = new UserSchema(newUser);

    user.validate(error => {
      error.errors.loginDate.should.exist;
      done();
    });
  });

});
