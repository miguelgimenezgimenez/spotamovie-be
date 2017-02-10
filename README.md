# spotamovie :movie_camera:

[![ Build Status](https://travis-ci.org/miguelgimenezgimenez/spotamovie-be.svg?branch=master)](https://travis-ci.org/miguelgimenezgimenez/spotamovie-be)

Connect to the Spotamovie API to get movie recommendations based on your Spotify playlists.



## Spotamovie API

Full documentation available on Apiary: https://jsapi.apiary.io/previews/spotamovie/reference



## :iphone:Spotamovie iOS App

Check out our iOS App

![spotamovie app](./Landing.png)



Github: https://github.com/johnandblue/spotamovieFE



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
