const express = require('express');
const router = express.Router();
const Buffer = require('buffer/').Buffer;
const request = require('request');

/* GET home page. */
router.post('/login', function(req, res, next) {
  const body = (req.body);
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: body.code,
      redirect_uri: body.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(body.client_id + ':' + body.client_secret).toString('base64')),
      'Accept': 'application/json',
      'Content-Type':'application/json'
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      //make api request to retrieve user profile
      const access_token = response.body.access_token;

      const options = {
         url: 'https://api.spotify.com/v1/me',
         headers: { 'Authorization': 'Bearer ' + access_token },
         json: true
       };

       // use the access token to access the Spotify Web API
       return request.get(options, function(error, response, body) {
         res.send(body);
       });
    }
    res.send({ error });
  });
});


module.exports = router;
