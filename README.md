# spotamovie :movie_camera:

[![ Build Status](https://travis-ci.org/miguelgimenezgimenez/spotamovie-be.svg?branch=master)](https://travis-ci.org/miguelgimenezgimenez/spotamovie-be)

Connect to the Spotamovie API to get movie recommendations based on your Spotify playlists.



## Spotamovie API

Full documentation available on Apiary: https://jsapi.apiary.io/previews/spotamovie/reference


## :iphone:Spotamovie iOS App (front-end)

Check out the iOS App that consumes the Spotamovie API:

How long do you spend looking for a movie rather than actually watching a movie? Our app solves that problem for you! Spotamovie is a mobile app, developed in React Native that allows users to connect with their Spotify accounts, and get movie recommendations based on their Spotify playlists.

![spotamovie app](./Landing.png)



Github for Spotamovie iOS app: https://github.com/2rod/spotamovie-frontend



## Tech Stack

**Server**: Node.js / Express

**Databases**: MongoDB, Redis

**Recommendation Engine**: [Raccoon](https://github.com/guymorita/recommendationRaccoon)

**Host**: Heroku

**Testing**: Mocha/Chai/Sinon

**Build Tool**: Travis CI



## APIs consumed

[Spotify](https://developer.spotify.com/web-api/)

[TMDB](https://www.themoviedb.org/documentation/api)



## Recommendation Example

|                     | User 1                   | User 2                   |
| ------------------- | ------------------------ | ------------------------ |
| 📻 **Songs Liked**  | \* "We are the Champions" | \* "We are the Champions" |
|                     | "Imagine"                | "We Built This City"     |
| 🎦 **Movies Liked** | *Star Wars*              | *E.T.*                   |
|                     | *Titanic*                | *Contact*                |
| **Possible Recs**   | *E.T*                    | *Star Wars*              |
|                     | *Contact*                | *Titanic*                |

\* = *Common Liked Song*


## Project Contributors
[Miguel Gimenez](https://github.com/miguelgimenezgimenez)

[Rod Reyes](https://github.com/2rod)

[JC Garcia](https://github.com/johnandblue)

[Varun Agarwal](https://github.com/vavarun)
