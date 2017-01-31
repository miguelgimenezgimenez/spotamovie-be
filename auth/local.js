const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config/spotifyConfig');

function encodeToken(token) {
  const playload = {
    exp: moment().add(20, 'days').unix(),
    iat: moment().unix(),
    sub: token
  };
  return jwt.encode(playload, config.client_secret);
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, config.client_secret);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

module.exports = {
  encodeToken,
  decodeToken
};
