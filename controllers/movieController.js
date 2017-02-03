const request = require('request');
const userController = require('./userController');
const UserSchema =require('../models/User');
const raccoon = require('raccoon');
const config = require('../config/dev.json');
const _ = require('underscore');

let movieController = {};


movieController.like=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      const movieId=req.params.movieId;
      raccoon.liked(userId,movieId, ()=>{
        console.log(userId,'liked',movieId);
      });
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  });
};
movieController.unlike=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      const movieId=req.params.movieId;
      raccoon.unliked(userId,movieId, ()=>{
        console.log(userId,'unliked',movieId);
      });
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  });
};

movieController.undislike=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      const movieId=req.params.movieId;
      raccoon.undisliked(userId,movieId, ()=>{
        console.log(userId,'undisliked',movieId);
      });
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  });
};
movieController.dislike=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      const movieId=req.params.movieId;
      raccoon.disliked(userId,movieId, ()=>{
        console.log(userId,'disliked',movieId);
      });
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  });
};


movieController.allLikes=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      let movie;
      raccoon.allLikedFor(userId,(results) => {
        return res.send(results);
      });
    }else{
      return res.sendStatus(401);
    }
  });
};
movieController.alldislikes=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      let movie;
      raccoon.allLikedFor(userId,(results) => {
        return res.send(results);
      });
    }else{
      return res.sendStatus(401);
    }
  });
};


movieController.recommendation=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      let movie;
      raccoon.recommendFor(userId, 10,rec => {
        return res.send(rec);
      });
    }else{
      return res.sendStatus(401);
    }
  });
};

const findRatedMovies=(userId)=>{
  return new Promise((resolve,reject)=>{
    raccoon.allWatchedFor(userId,results => {
      const ratedMovies= results.filter(like =>!like.includes('SP'));
      return resolve(ratedMovies);
    });
  });
};


const handleMovies = (moviesToBeSent,n,moviesAllreadyRecommended) =>{
  moviesToBeSent=_.difference(moviesToBeSent,moviesAllreadyRecommended);
  console.log(moviesToBeSent, 'moviesToBeSent');
  console.log('moviesAllreadyRecommended', moviesAllreadyRecommended);
  return moviesToBeSent.slice(0,n);
};


movieController.survey=(req,res)=>{

  let url =`https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}`;
  let numberOfmovies=1;
  let k=0;
  let moviesToBeSent=[];
  let ratedMovies=[];
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(user=>{
    if (user.length===0) return res.sendStatus(401);

    const userId=user[0].spotifyId;
    userController.updateUser(userId,{firstLogin:true})
    //Handle first login
    .then(user=>{
      if(user.firstLogin){
        numberOfmovies=4;
        k=1;
      }
      //======================================================
      // GET TMDB movies
      //======================================================
      request.get(url, (error, response, body) => {
        let receivedMovies=JSON.parse(body).results.map((movie=>movie.id));

        findRatedMovies(userId)
        .then(response=>{
          ratedMovies=response;
          moviesToBeSent=moviesToBeSent.concat(handleMovies(receivedMovies,numberOfmovies,ratedMovies));
          ratedMovies=ratedMovies.concat(moviesToBeSent);
          //GET POPULAR MOVIES
          request.get(`${url}&sort_by=popularity.desc`, (error, response, body) => {
            receivedMovies=JSON.parse(body).results.map((movie=>movie.id));
            moviesToBeSent=moviesToBeSent.concat(handleMovies(receivedMovies,numberOfmovies,ratedMovies));
            ratedMovies=ratedMovies.concat(moviesToBeSent);
            const page =Math.floor(Math.random()*10)+10;
            url+=`&page=${page}`;
            //GET WEIRD MOVIES
            request.get(`${url}&sort_by=popularity.asc`, (error, response, body) => {
              receivedMovies=JSON.parse(body).results.map((movie=>movie.id));
              moviesToBeSent=moviesToBeSent.concat(handleMovies(receivedMovies,numberOfmovies,ratedMovies));
              return res.send(moviesToBeSent);
            });
          });
        });
      });
    });
  });
};


module.exports=movieController;
