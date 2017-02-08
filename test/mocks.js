
const mocks = {};

mocks.createObj = (property, value) => {
  const newObj = {};
  newObj[property] = value;

  return newObj;
};

mocks.updateObj = (obj, property, value) => {
  obj.property = value;
  return obj;
};

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

mocks.playlistId1 = 11111;
mocks.playlistId2 = 22222;

mocks.playlists = {
  body: {
    items: [{id: mocks.playlistId1}, {id: mocks.playlistId2}]
  }
};

mocks.track1 = 121212;
mocks.track2 = 232323;
mocks.track3 = 343434;
mocks.track4 = 454545;

mocks.tracks = {
  body: {
    items: [
      {track: {id: mocks.track1}},
      {track: {id: mocks.track2}},
      {track: {id: mocks.track3}},
      {track: {id: mocks.track4}}
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
    "firstLogin" : true,
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
