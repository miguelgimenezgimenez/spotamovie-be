const request = require('request');
const raccoon = require('./raccoonController');

let songController = {};

const authHeaders = (auth_token) => ({
  headers: { 'Authorization': 'Bearer ' + auth_token },
  json: true,
});

let songs = [];

songController.processData = (user, access_token) => {
  return new Promise((resolve, reject) => {
    // retrieve current user's playlists
    const options = authHeaders(access_token);

    options['url'] = 'https://api.spotify.com/v1/me/playlists';

    getPlaylists(options)
    .then((playlists) => {
      if (playlists) {
        processPlaylists(playlists, options, user.spotifyId)
        .then(songs => {
          console.log('songs', songs);
          // send songs and user_id to raccoon; use prefix to help label them as Spotify song id's
          likeSongs(songs, user.spotifyId);
        });
      }
      else console.log('no playlists');
    });

  });
};

const getPlaylists = (options) => {
  return new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if (error) return reject(error);
      return resolve(body.items.map((playlist) => playlist.id));
    });
  });
};

const processPlaylists = (playlists, options, userId) => {
  return new Promise((resolve, reject) => {

    // iterate thru each playlist to retrieve all songs
    playlists.forEach((playlist_id) => {
      options['url'] = `https://api.spotify.com/v1/users/${userId}/playlists/${playlist_id}/tracks`;

      getSongsByPlaylist(playlist_id, options)
      .then((songList)=>{
        console.log('songList', songList);
        if (songList.items.length > 0) {
          songList.items.forEach((song) => {
            // if (songs.includes(song.track.id)) return;
            console.log('song id', song.track.id);
            songs.push(song.track.id);
          });
          console.log('songs after iterating thru ', playlist_id, ': ', songs);
          resolve(songs);
        }
        else return;
      })
      .catch(err => {
        reject(err);
      });

      return resolve(songs);

    });
  });
};

const getSongsByPlaylist = (playlist_id, options) => {
  return new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      console.log('body in getSongsByPlaylist', body);
      return resolve(body);
    });
  });
};

const likeSongs = (songs, userId) => {
  songs.forEach(song => {
    raccoon.liked(`SP${song}`, userId, ()=>{
      console.log('liked song!', song);
    });
  });
};

module.exports = songController;
