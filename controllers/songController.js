const request = require('request');
const raccoon = require('raccoon');
let songController = {};
const loginController = require('./loginController');

const authHeaders = (auth_token) => ({
  headers: { 'Authorization': 'Bearer ' + auth_token },
  json: true,
});

let songs = [];

songController.storePlaylists = (user, access_token,req) => {

  const options = authHeaders(access_token);
  options['url'] = 'https://api.spotify.com/v1/me/playlists';
  req.spotifyApi.getUserPlaylists(user.spotifyId)
  .then((data) => {
    if (data.body.items) {
      const playlists=data.body.items.map((playlist) => playlist.id);
        return processPlaylists(playlists, options, user.spotifyId) ;
    }
    else {
      console.log('no playlists');
      return;
    }
  })
  .then(songs => {
    likeSongs(songs, user.spotifyId);
  })
  .catch((err) => {
    console.log(err, "error in songController");
  });
};

const processPlaylists = (playlists, options, userId) => {
  return new Promise((resolve, reject) => {
    getSongs(playlists, options,userId)
    .then((allSongs)=>{
      console.log(allSongs, "ALl SONGS");
      resolve(allSongs);
    })
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
        if (count===playlists.length) return resolve(allSongs);

      });
    });
  });
};
const getSongsByPlaylist=(playlist_id,options,userId)=>{
  return new Promise((resolve, reject) =>  {
    options['url'] = `https://api.spotify.com/v1/users/${userId}/playlists/${playlist_id}/tracks`;
    request.get(options, (error, response, body) => {
      console.log(body, 'body');
      if (error) {
        console.log('playlist not found',playlist_id);
        reject(error);
      }
      return resolve(body);
    });
  });
};

const likeSongs = (songs, userId) => {
  songs.forEach(song => {
    const songId=`SP${song}`;
    raccoon.allLikedFor(userId,results=> {
      for (var i = 0; i < results.length; i++) {
        if (songId===results[i]) return;
      }
      raccoon.liked(userId,songId, ()=>{
        console.log(userId,'liked',songId);
      });
    });

  });
};


module.exports = songController;
