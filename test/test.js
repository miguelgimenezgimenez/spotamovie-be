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

chai.use(chaiHttp);
chai.use(sinonChai);

let stubAuth, stubGetMe, stubGetUserPlaylists, stubGetPlaylistTracks;

describe('Login:', () => {
  let request, response;
  beforeEach(() => {
    request = {
      spotifyApi: new spotifyWebApi({
        clientId : 'SPOTIFY_CLIENT_ID',
        clientSecret : 'SPOTIFY_CLIENT_SECRET',
        redirectUri : 'SPOTIFY_REDIRECT_URI'
      })
    };

    stubAuth = Stub.createStub(request.spotifyApi, 'authorizationCodeGrant',
      {
        statusCode: 200,
        body: { access_token: 'token' }
      });

    stubGetMe = Stub.createStub(request.spotifyApi, 'getMe',
      {
        body: {
          country: 'ES',
          display_name: 'Ro Rey',
          email: 'someone@gmail.com',
          external_urls: { spotify: 'https://open.spotify.com/user/djdjdjdj' },
          followers: { href: null, total: 0 },
          href: 'https://api.spotify.com/v1/users/djdjdjdj',
          id: 'ou2o3iu453245',
          images: [ [Object] ],
          product: 'open',
          type: 'user',
          uri: 'spotify:user:djdjdjdj'
        }
      });

    stubGetUserPlaylists = Stub.createStub(request.spotifyApi, 'getUserPlaylists', { body: { items: [{id: 3838383}, {id: 393939}] }});

    stubGetPlaylistTracks = Stub.createStub(request.spotifyApi, 'getPlaylistTracks', { body: { items: [{track: {id: 2423}}, {track: {id: 7474}}, {track: {id: 92929}}, {track: {id: 94949}}]}});

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
    request.body = {
      code: '83838383k3i'
    };

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
      body: {
        code: '83838383k3i'
      },
      spotifyApi: new spotifyWebApi({
        clientId : null,
        clientSecret : null,
        redirectUri : 'SPOTIFY_REDIRECT_URI'
      })
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
    request.body = {
      code: '83838383k3i'
    };

    const spotifyMockError = {
      "error": "invalid_grant",
      "error_description": "Invalid authorization code"
    };

    stubAuth.restore();

    stubAuth = Stub.createStub(request.spotifyApi, 'authorizationCodeGrant',
      {
        statusCode: 400,
        body: spotifyMockError
      });

    response.send = (obj) => {
      try {
        response.status.should.be.eq(400);
        obj.should.be.eq(spotifyMockError);
        done();
      } catch (err) {
        done(err);
      }

    };

    loginController.login(request, response);

  });

});
