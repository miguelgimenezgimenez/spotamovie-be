# spotamovie :movie_camera:

Connect to the Spotamovie API to get movie recommendations based on your Spotify playlists.



# Spotamovie API

Full documentation available on Apiary: https://jsapi.apiary.io/previews/spotamovie/reference



**API Endpoint**: https://spotamovie.herokuapp.com



**Spotify authentication**

```javascript
/login
```



**Like a movie**

```javascript
/movies/{movie_id}/like
```



**Dislike a movie**

```javascript
/movies/{movie_id}/dislike
```



**Get a movie recommendation**

```javascript
/movies/recommendation
```



**Get movies for movie survey**

```javascript
/movies/survey
```



**Get a list of all liked movies**

```javascript
/movies/liked
```



**Unlike a movie**

```javascript
/movies/{movie_id}/unlike
```



**Undislike a movie**

```javascript
/movies/{movie_id}/undislike
```



## :iphone:Spotamovie iOS App

Check out our iOS App

<img src="./Landing.png" style="width:200px"/>



Github: https://github.com/johnandblue/spotamovieFE



## Tech Stack

**Server**: Node.js / Express

**Databases**: MongoDB, Redis

**Recommendation** Engine: Raccoon

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
|                     |                          |                          |
| 🎦 **Movies Liked** | *Star Wars*              | *E.T.*                   |
|                     | *Titanic*                | *Contact*                |
|                     |                          |                          |
| **Possible Recs**   | *E.T*                    | *Star Wars*              |
|                     | *Contact*                | *Titanic*                |

\* = *Common Liked Song*
