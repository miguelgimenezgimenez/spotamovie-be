const spotifyWebApi = require('spotify-web-api-node');
const config = require('../config/spotifyConfig');

const spotifyApi = new spotifyWebApi({
  clientId : config.SPOTIFY_CLIENT_ID,
  clientSecret : config.SPOTIFY_CLIENT_SECRET,
  redirectUri : config.SPOTIFY_REDIRECT_URI
});

module.exports = spotifyApi;
