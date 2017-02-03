const spotifyWebApi = require('spotify-web-api-node');
const nconf = require('../config/nconf');

const spotifyApi = new spotifyWebApi({
  clientId : nconf.get('SPOTIFY_CLIENT_ID'),
  clientSecret : nconf.get('SPOTIFY_CLIENT_SECRET'),
  redirectUri : nconf.get('SPOTIFY_REDIRECT_URI')
});

module.exports = spotifyApi;
