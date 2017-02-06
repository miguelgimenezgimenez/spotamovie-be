const mocks = {};

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

mocks.authCodeBody = {
  code: '999999999'
};

mocks.authResponseObj = {
  statusCode: 200,
  body: { access_token: 'token12345' }
};

mocks.spotifyAuthError = {
  "error": "invalid_grant",
  "error_description": "Invalid authorization code"
};

mocks.spotifyAuthErrReponse = {
  statusCode: 400,
  body: mocks.spotifyMockError
};

mocks.userProfile = {
  body: {
    country: 'ES',
    display_name: 'Ro Rey',
    email: 'someone@gmail.com',
    external_urls: { spotify: 'https://open.spotify.com/user/djdjdjdj' },
    followers: { href: null, total: 0 },
    href: 'https://api.spotify.com/v1/users/djdjdjdj',
    id: 'djdjdjdj',
    images: [ [Object] ],
    product: 'open',
    type: 'user',
    uri: 'spotify:user:djdjdjdj'
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
