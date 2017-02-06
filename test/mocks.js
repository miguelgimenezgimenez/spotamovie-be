const mocks = {};

// mock Spotify data
mocks.spotifyObj = {
  clientId : '123456',
  clientSecret : 'abcdef',
  redirectUri : 'spotamovie://callback'
};

mocks.spotifyObjInvalid = {
  clientId : null,
  clientSecret : null,
  redirectUri : 'spotamovie://callback'
};

mocks.authCode = '999999999';

mocks.authCodeBody = {
  code: mocks.authCode
};

mocks.accessToken = 'token12345';

mocks.authResponseObj = {
  statusCode: 200,
  body: { access_token: mocks.accessToken }
};

mocks.spotifyAuthError = {
  "error": "invalid_grant",
  "error_description": "Invalid authorization code"
};

mocks.spotifyAuthErrReponse = {
  statusCode: 400,
  body: mocks.spotifyAuthError
};

mocks.authHeader = {
  authorization: 'Bearer ' + mocks.accessToken
};

mocks.authHeaderMissing = {
  authorization: null
};

mocks.spotifyId = 'spotify234234';

mocks.userProfile = {
  body: {
    country: 'ES',
    display_name: 'John Doe',
    email: 'jdoe@gmail.com',
    external_urls: { spotify: 'https://open.spotify.com/user/' + mocks.spotifyId },
    followers: { href: null, total: 0 },
    href: 'https://api.spotify.com/v1/users/' + mocks.spotifyId,
    id: mocks.spotifyId,
    images: [ [Object] ],
    product: 'open',
    type: 'user',
    uri: 'spotify:user:' + mocks.spotifyId
  }
};

mocks.playlists = {
  body: {
    items: [{id: 11111}, {id: 22222}]
  }
};

mocks.tracks = {
  body: {
    items: [
      {track: {id: 121212}},
      {track: {id: 232323}},
      {track: {id: 343434}},
      {track: {id: 454545}}
    ]
  }
};

// mock users collection data
mocks.userInfo = {
  display_name: mocks.userProfile.body.display_name,
  email: mocks.userProfile.body.email,
  id: mocks.spotifyId
};

mocks.userInfoInvalid1 = {
  token: mocks.accessToken,
  loginDate: Date.now()
};

mocks.userInfoInvalid2 = {
  spotifyId: mocks.spotifyId,
  loginDate: Date.now()
};

mocks.userInfoInvalid3 = {
  spotifyId: mocks.spotifyId,
  token: mocks.accessToken
};

mocks.userObj = {
  "name": mocks.userProfile.body.display_name,
  "spotifyId": mocks.spotifyId,
  "userToken": mocks.accessToken,
  loginDate: Date.now()
};

mocks.userDocNew = {
    "_id" : "1234567890abcdefghijk",
    "name" : mocks.userProfile.body.display_name,
    "email" : mocks.userProfile.body.email,
    "spotifyId" : mocks.spotifyId,
    "userToken" : mocks.accessToken,
    "loginDate" : Date.now(),
    "firstLogin" : false,
    "createdAt" : Date.now(),
    "__v" : 0
};

mocks.userDocOld = {
    "_id" : "1234567890abcdefghijk",
    "name" : mocks.userProfile.body.display_name,
    "email" : mocks.userProfile.body.email,
    "spotifyId" : mocks.spotifyId,
    "userToken" : mocks.accessToken,
    "loginDate" : 1481054578000,
    "firstLogin" : false,
    "createdAt" : "2016-12-01",
    "__v" : 0
};

module.exports = mocks;
