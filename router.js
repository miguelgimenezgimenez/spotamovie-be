const express = require('express');
const router = express.Router();
const Buffer = require('buffer/').Buffer;
const request = require('request');

let songs = [];
let access_token = '';

router.post('/login', function(req, res, next) {
  const body = (req.body);
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: body.code,
      redirect_uri: body.redirect_uri,
      grant_type: body.grant_type
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(body.client_id + ':' + body.client_secret).toString('base64')),
      'Accept': 'application/json',
      'Content-Type':'application/json'
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    let user_id;
    if (!error && response.statusCode === 200) {
      //make api request to retrieve user profile
      access_token = response.body.access_token;
      const options = {
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      // retreive user profile
      options['url'] = 'https://api.spotify.com/v1/me';

      request.get(options, (error, response, body) => {
        user_id = body.id;
        // send user profile
        res.send(body);
        // retrieve current user's playlists
        options['url'] = 'https://api.spotify.com/v1/me/playlists';
        request.get(options, (error, response, body) => {
          const playlists = body.items.map((playlist) => playlist.id);

          // iterate thru each playlist to retrieve all songs
          playlists.forEach((playlist_id) => {
            options['url'] = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`;
            request.get(options, (error, response, body) => {
                body.items.forEach((song) => {
                  if (songs.includes(song.track.id)) return;
                  songs.push(song.track.id);
                });
                // TODO: send songs and user_id to raccoon
            });
          });
        });
      });
    } else res.send({ error });
  });
});


module.exports = router;
