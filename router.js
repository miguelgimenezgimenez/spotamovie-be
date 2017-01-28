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
      console.log(response.body.access_token, 'response');
    }

  });
});


module.exports = router;
