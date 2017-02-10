
const Buffer = require('buffer/').Buffer;
const request = require('request');

const userController = require('./userController');
const songController = require('./songController');
const nconf = require('../config/nconf');
const UserSchema =require('../models/User');

const loginController = {};

loginController.login = (req, res, next) => {
  const body = (req.body);
  let token = {};
  let spotifyUserProfile;
  if (!body.code) return res.sendStatus(400);
  else if (!req.spotifyApi._credentials.clientId) return res.sendStatus(500);
  req.spotifyApi.authorizationCodeGrant(body.code)
  .then(data => {
    if (data.statusCode === 200) {
      token.access_token = data.body['access_token'];
      token.expires_in = data.body['expires_in'];
      token.refresh_token = data.body['refresh_token'];
      // set access token
      req.spotifyApi.setAccessToken(data.body['access_token']);
      req.spotifyApi.setRefreshToken(data.body['refresh_token']);
      return data;
    } else {
      res.status = data.statusCode;
      res.send(data.body);
      return data.body;
    }
  }, (err) => console.log(err))
  .then((result) => {
    if (result.error) return;
    req.spotifyApi.getMe()
    .then(data => {
      return data;
    })
    .then(userInfo => {
      spotifyUserProfile = userInfo;
      // retrieve the user from DB
      // save it in the DB if it doesn't exist
      return UserSchema.find({spotifyId:userInfo.body.id})
      .then((user) => {
        if (user.length > 0) {
          return userController.updateUser(user[0].spotifyId,{userToken:req.spotifyApi._credentials.accessToken})
          .then(user=>{
            res.status = 200;
            res.send(user);
            return songController.storePlaylists(user, req.spotifyApi._credentials.accessToken, req);
          });
        }
        else {
          return userController.newUser(spotifyUserProfile,req.spotifyApi._credentials.accessToken)
          .then(user => {
            res.status = 200;
            res.send(user);
            return songController.storePlaylists(user, req.spotifyApi._credentials.accessToken, req);
          })
          .catch(err => {
            console.log(err);
          });
        }
      });
    });
  }, (err) => console.log(err))
  .catch(err => {
    res.status = 400;
    res.send(err);
  });
};

module.exports = loginController;
