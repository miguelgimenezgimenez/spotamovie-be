const request = require('request');
const raccoonController = require('./raccoonController');
let songController = {};

const authHeaders = (auth_token) => ({
  headers: { 'Authorization': 'Bearer ' + auth_token },
  json: true,
});

let songs = [];

songController.processData = (user, access_token) => {
  const options = authHeaders(access_token);
  options['url'] = 'https://api.spotify.com/v1/me/playlists';
  getPlaylists(options)
  .then((playlists) => {
    if (playlists) {
      return processPlaylists(playlists, options, user.spotifyId)        ;
    }
    else console.log('no playlists');
  })
  .then(songs => {
    likeSongs(songs, user.spotifyId);
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
    getSongs(playlists, options,userId)
    .then((allSongs)=>{
      resolve(allSongs);
    }
  )
  .catch(err => {
    reject(err);
  });
});
};

const getSongs = (playlists, options,userId) => {
  const allSongs=[];
  let count=0;
  return new Promise((resolve, reject) => {
    playlists.forEach((playlist_id) => {
      getSongsByPlaylist(playlist_id,options,userId)
      .then(songsInPlaylist=>{
        if (songsInPlaylist.items) {
          songsInPlaylist.items.forEach(item=>{
            allSongs.push(item.track.id);
          });
        }
        count++;
        if (count===playlists.length-1) return resolve(allSongs);
      });
    });
  });
};
const getSongsByPlaylist=(playlist_id,options,userId)=>{
  return new Promise((resolve, reject) =>  {
    options['url'] = `https://api.spotify.com/v1/users/${userId}/playlists/${playlist_id}/tracks`;
    request.get(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      return resolve(body);
    });
  });
};

const likeSongs = (songs, userId) => {
  songs.forEach(song => {
    raccoonController.liked(`SP${song}`, userId, ()=>{
    });
  });
};

module.exports = songController;
