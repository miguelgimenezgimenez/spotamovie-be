process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');

let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const PassThrough = require('stream').PassThrough;
const server = require('../index');
let should = chai.should();
const nconf = require('../config/nconf.js');
const spotifyWebApi = require('spotify-web-api-node');

const loginController = require('../controllers/loginController');
const Stub = require('./stub');
const mocks = require('./mocks');

chai.use(chaiHttp);
chai.use(sinonChai);

let stubAuth, stubGetMe, stubGetUserPlaylists, stubGetPlaylistTracks;

describe('Login:', () => {
  let request, response;
  beforeEach(() => {
    request = {
      spotifyApi: new spotifyWebApi(mocks.spotifyObj)
    };

    stubAuth = Stub.createStub(request.spotifyApi, 'authorizationCodeGrant', mocks.authResponseObj);

    stubGetMe = Stub.createStub(request.spotifyApi, 'getMe', mocks.userProfile);

    stubGetUserPlaylists = Stub.createStub(request.spotifyApi, 'getUserPlaylists', mocks.playlists);

    stubGetPlaylistTracks = Stub.createStub(request.spotifyApi, 'getPlaylistTracks', mocks.tracks);

    response = {};
  });

  afterEach(() => {
    Stub.removeStub(stubAuth);
    Stub.removeStub(stubGetMe);
    Stub.removeStub(stubGetUserPlaylists);
    Stub.removeStub(stubGetPlaylistTracks);

    response = {};
  });

  it('login should succeed given proper user credentials', (done) => {
    request.body = mocks.authCodeBody;

    response.send = (obj) => {
      try {
        response.status.should.be.eq(200);
        obj.should.be.a('object');
        obj.should.have.property('userToken');
        obj.should.have.property('name');
        done();
      } catch (err) {
        done(err);
      }

    };

    loginController.login(request, response);

  });

  it('login should fail without an authorization code', (done) => {
    request.body = {};

    response.sendStatus = (status) => {
      try {
        status.should.be.eq(400);
        done();
      } catch (err) {
        done(err);
      }
    };

    loginController.login(request, response);

  });

  it('login should fail without proper Spotify API credentials', (done) => {
    request = {
      body: mocks.authCodeBody,
      spotifyApi: new spotifyWebApi(mocks.spotifyObjInvalid)
    };

    response.sendStatus = (status) => {
      try {
        status.should.be.eq(500);
        done();
      } catch (err) {
        done(err);
      }
    };

    loginController.login(request, response);

  });

  it('login should fail if authorization fails', (done) => {
    request.body = mocks.authCodeBody;

    Stub.removeStub(stubAuth);

    stubAuth = Stub.createStub(request.spotifyApi, 'authorizationCodeGrant', mocks.spotifyAuthErrReponse);

    response.send = (obj) => {
      try {
        response.status.should.be.eq(400);
        obj.should.be.eq(mocks.spotifyAuthError);
        done();
      } catch (err) {
        done(err);
      }

    };

    loginController.login(request, response);

  });

});
