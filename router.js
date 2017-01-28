const express = require('express');
const router = express.Router();
const Buffer = require('buffer/').Buffer;
const request = require('request');
const raccoon = require('./controllers/raccoonController');

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
        if (error) {
          res.send({ error });
          return;
        }
        user_id = body.id;
        // send user profile
        res.send(body);
        // retrieve current user's playlists
        options['url'] = 'https://api.spotify.com/v1/me/playlists';
        request.get(options, (error, response, body) => {
          if (error) {
            res.send({ error });
            return;
          }
          const playlists = body.items.map((playlist) => playlist.id);

          // iterate thru each playlist to retrieve all songs
          playlists.forEach((playlist_id) => {
            options['url'] = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`;
            request.get(options, (error, response, body) => {
              if (error) {
                res.send({ error });
                return;
              }
              body.items.forEach((song) => {
                if (songs.includes(song.track.id)) return;
                songs.push(song.track.id);
              });
              // send songs and user_id to raccoon; use prefix to help label them as Spotify song id's
              songs.forEach((song) => {
                raccoon.like('SP-' + song, user_id)
                .then(() => {
                  raccoon.stat.recommendFor(user_id, 5)
                  .then((recs) => {
                    console.log('recs for ', user_id, ': ', recs);
                  });
                });
              });
            });
          });
        });
      });
    } else res.send({ error });
  });
});


module.exports = router;
