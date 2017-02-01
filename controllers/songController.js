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
  // getPlaylists(options,req)
  req.spotifyApi.getUserPlaylists(user.spotifyId)
  .then((playlists) => {
    if (playlists) {
      return processPlaylists(playlists, options, user.spotifyId) ;
    }
    else console.log('no playlists');
  })
  .then(songs => {
    likeSongs(songs, user.spotifyId);
  })
  .catch((err) => {

  });
};

const getPlaylists = (options,req) => {
  return new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if(body.error) {
        if (body.error.status===401) {
          req.spotifyApi.refreshAccessToken()
          .then(res=>{
            options = authHeaders(req.spotifyApi._credentials.accessToken);
            options['url'] = 'https://api.spotify.com/v1/me/playlists';
            return;
          });
        }
      }
      // console.log(options, "OPTION");
      if (error) return reject(error);
      if (body.items) {
        return resolve(body.items.map((playlist) => playlist.id));
      }
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
