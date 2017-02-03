const request = require('request');
const raccoon = require('raccoon');
let songController = {};
const loginController = require('./loginController');

let songs = [];

songController.storePlaylists = (user, access_token, req) => {
  req.spotifyApi.getUserPlaylists(user.spotifyId)
  .then((data) => {
    if (data.body.items) {
      const playlists=data.body.items.map((playlist) => playlist.id);
        return processPlaylists(playlists, user.spotifyId, req) ;
    }
    else {
      console.log('no playlists');
      return;
    }
  })
  .then(songs => {
    songController.likeSongs(songs, user.spotifyId);
    return songs;
  })
  .catch((err) => {
    console.log(err, "error in songController");
  });
};

const processPlaylists = (playlists, userId, req) => {
  return new Promise((resolve, reject) => {
    getSongs(playlists, userId, req)
    .then((allSongs)=>{
      resolve(allSongs);
    })
    .catch(err => {
      reject(err);
    });
  });
};

const getSongs = (playlists, userId, req) => {
  const allSongs=[];
  let count=0;
  return new Promise((resolve, reject) => {
    playlists.forEach((playlist_id) => {
      getSongsByPlaylist(playlist_id, userId, req)
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
const getSongsByPlaylist=(playlist_id, userId, req)=>{
  return new Promise((resolve, reject) =>  {
    req.spotifyApi.getPlaylistTracks(userId, playlist_id)
    .then((data) => {
      resolve(data.body);
    })
    .catch((err) => {
      console.log(err, "error retrieving playlist songs");
    });
  });
};

songController.likeSongs = (songs, userId) => {
  try {
    songs.forEach(song => {
      const songId=`SP${song}`;
      raccoon.allLikedFor(userId,results=> {
        for (var i = 0; i < results.length; i++) {
          if (songId===results[i]) return;
        }
        raccoon.liked(userId,songId, ()=>{
        });
      });
    });
  } catch (err) {
    console.log('error in likeSongs', err);
  }
};


module.exports = songController;
