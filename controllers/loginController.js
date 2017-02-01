const Buffer = require('buffer/').Buffer;
const request = require('request');
const userController = require('./userController');
const songController = require('./songController');
// const spotifyAPI =  new require('../auth/spotifyAPI')();
const config = require('../config/spotifyConfig');
// const localAuth = require('../auth/local');
// const bcrypt = require('../auth/bcrypt');
const loginController = {};





loginController.login = (req, res, next) => {
  const body = (req.body);
  let access_token;
  let spotifyUserProfile;
  getToken(body)
  .then(token => {
    // spotifyAPI.setAccesToken(token);
    access_token = token;
    // encodedToken= localAuth.encodeToken(token);
    // spotifyAPI[token]=encodedToken;
    return getUserInfo(token);
  })
  .then(userInfo => {
    spotifyUserProfile=userInfo;
    // retrieve the user from DB
    // save it in the DB if it doesn't exist
    // res.sending the user info
    return userController.getUser(access_token);
  })
  .then((user) => {
    if (user.length > 0) {
      return userController.setToken(user[0].spotifyId,access_token);
    }
    else{
      return userController.newUser(spotifyUserProfile,access_token);
    }
  })
  .then(user => {
    res.send(user);
    return songController.processData(user, access_token);
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
    redirect_uri: config.redirect_uri,
    grant_type: 'authorization_code'
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



module.exports = loginController;
