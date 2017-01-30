const Buffer = require('buffer/').Buffer;
const request = require('request');
const raccoon = require('./raccoonController');
const userController = require('./userController');
// const spotifyAPI = new require('../spotifyAPI')()
const config = require('../config/spotifyConfig');

let songs = [];
const loginController = {};

loginController.login = (req, res, next) => {
  const body = (req.body);
  let access_token;

  getToken(body)
  .then(token => {
    // spotifyAPI.setAccesToken(token);
    access_token = token;
    return getUserInfo(token);
  })
  .then(userInfo => {
    // retrieve the user from DB
    // save it in the DB if it doesn't exist
    // res.sending the user info
    if (userController.getUser(userInfo.id)){
      userController.setToken(userInfo.id,access_token);
    }
    else{
      userController.newUser(userInfo,access_token);
    }

    const user = userInfo; // This actually has to be the DB record
    console.log('user', user);
    res.send(user);
    return processData(user, access_token);
  })
  .catch(err => {
    res.send(err);
  });
  // next();
};

const authOptions = (body) => ({
  url: 'https://accounts.spotify.com/api/token',
  form: {
    code: body.code,
    redirect_uri: body.redirect_uri,
    grant_type: body.grant_type
  },
  headers: {
    'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64')),
    'Accept': 'application/json',
    'Content-Type':'application/json'
  },
  json: true
});

const authHeaders = (auth_token) => ({
  headers: { 'Authorization': 'Bearer ' + auth_token },
  json: true,
});

const getToken = (body) => {
  return new Promise((resolve, reject) => {
    request.post(authOptions(body), function(error, response, body) {
      if(error) return reject(error);
      return resolve(response.body.access_token);
    });
  });
};

const getUserInfo = (access_token) => {
  return new Promise((resolve, reject) => {
    const options = authHeaders(access_token);

    // retreive user profile
    options['url'] = 'https://api.spotify.com/v1/me';

    request.get(options, (error, response, body) => {
      if (error) return reject(error);

      const user_id = body.id;
      // send user profile
      return resolve(body);
    });
  });
};

const processData = (user, access_token) => {
  return new Promise((resolve, reject) => {
    // retrieve current user's playlists
    const options = authHeaders(access_token);

    options['url'] = 'https://api.spotify.com/v1/me/playlists';

    request.get(options, (error, response, body) => {
      if (error) return reject(error);

      const playlists = body.items.map((playlist) => playlist.id);

      // iterate thru each playlist to retrieve all songs
      playlists.forEach((playlist_id) => {
        options['url'] = `https://api.spotify.com/v1/users/${user.id}/playlists/${playlist_id}/tracks`;
        request.get(options, (error, response, body) => {
          if (error) {
            // res.send({ error });
            return;
          }
          body.items.forEach((song) => {
            if (songs.includes(song.track.id)) return;
            songs.push(song.track.id);
          });
          // send songs and user_id to raccoon; use prefix to help label them as Spotify song id's
          console.log('songs: ', songs);
          // songs.forEach((song) => {
          //   raccoon.liked('SP-' + song, user_id, () => { raccoon.stat.recommendFor(user_id, 5, (recs) => {
          //     console.log('recs for ', user_id, ': ', recs);
          //   }); });
          //
          // });
          songs.forEach(song => {
            raccoon.liked(`SP${song}`, user.id, ()=>{});
          });
        });
      });
    });
  });
};

module.exports = loginController;
