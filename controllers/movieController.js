const request = require('request');
const userController = require('./userController');
const UserSchema =require('../models/User');
const raccoon = require('raccoon');
const config = require('../config/dev.json');

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
movieController.recommendation=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      let movie;
      raccoon.recommendFor(userId, 1,(recs) => {
        console.log(recs);
        movie=recs[0];
        return res.send({movie:movie});
      });
    }else{
      return res.sendStatus(401);
    }
  });
};
movieController.allLikes=(req,res)=>{

};
movieController.alldislikes=(req,res)=>{



};


const findRatedMovies=(userId)=>{
  const userRated=[];
  const ratedMovies={};
  raccoon.allLikedFor(userId,(results) => {
    userRated.push(results) ;
  });
  raccoon.allDislikedFor(userId,(results) => {
    userRated.push(results);
  });
  userRated.forEach(like =>{
    if (!like.includes('SP'))ratedMovies[like]='rated' ;
  });
  return ratedMovies;
};


movieController.survey=(req,res)=>{

  let url =`https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}`;
  let numberOfmovies=10;
  const returnedMovies=[];
  let ratedMovies={};
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(user=>{
    if (user.length>0) {

      const userId=user[0].spotifyId;
      userController.updateUser(userId,{firstLogin:false})
      .then(user=>{
        const page=Math.floor(Math.random()*999);
        url+=`&page=${page}`;
        request.get(url, (error, response, body) => {
          const tmdbMovies=JSON.parse(body);
          console.log(tmdbMovies.results[0].id);
          if (!user.firstLogin) {
            numberOfmovies=3;
            ratedMovies=findRatedMovies(userId);
          }
          let index=0;
          while (returnedMovies.length<numberOfmovies) {
            if (!ratedMovies.hasOwnProperty(tmdbMovies.results[index].id)) {
              returnedMovies.push(tmdbMovies.results[index].id);
            }
            index++;
          }
          res.send(returnedMovies);
        });
      });

    }else{

      return res.sendStatus(401);
    }
  });

};


module.exports=movieController;
