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
const sinonStub = require('./stub');

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Movies', () => {
  let request, response;
  beforeEach(() => {
    request = {
      body: {
        code: '83838383k3i'
      },
      spotifyApi: new spotifyWebApi({
        clientId : 'SPOTIFY_CLIENT_ID',
        clientSecret : 'SPOTIFY_CLIENT_SECRET',
        redirectUri : 'SPOTIFY_REDIRECT_URI'
      })
    };

    const stubAuth = sinonStub(request.spotifyApi, 'authorizationCodeGrant',
      {
        statusCode: 200,
        body: { access_token: 'token' }
      });

    const stubGetMe = sinonStub(request.spotifyApi, 'getMe',
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

    const stubGetUserPlaylists = sinonStub(request.spotifyApi, 'getUserPlaylists', { body: { items: [{id: 3838383}, {id: 393939}] }});

    const stubGetPlaylistTracks = sinonStub(request.spotifyApi, 'getPlaylistTracks', { body: { items: [{track: {id: 2423}}, {track: {id: 7474}}, {track: {id: 92929}}, {track: {id: 94949}}]}});

    response = {
      send: (obj) => { this.body = obj; }
    };
  });

  it('loginController', (done) => {
    response.send = (obj) => {
      console.log('this is obj', obj);
      done();
    };

    loginController.login(request, response);

  });
});
