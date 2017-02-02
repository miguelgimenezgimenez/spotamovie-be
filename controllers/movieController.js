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
      raccoon.recommendFor(userId, 1,rec => {

        return res.send(rec);
      });
    }else{
      return res.sendStatus(401);
    }
  });
};
movieController.allLikes=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      console.log(userId, 'id');
      let movie;
      raccoon.allLikedFor(userId,(results) => {
        console.log(results);
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


const findRatedMovies=(userId)=>{
  return new Promise((resolve,reject)=>{
    let userRated=[];
    const ratedMovies={};
    raccoon.allWatchedFor(userId,results => {
      results.forEach(like =>{
        if (!like.includes('SP'))ratedMovies[like]='rated' ;
      });
      return resolve(ratedMovies);
    });
  });
};



movieController.survey=(req,res)=>{

  let url =`https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}`;
  let numberOfmovies;
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

          user.firstLogin?numberOfmovies=10: numberOfmovies=3;

          findRatedMovies(userId)
          .then(response=>{
            ratedMovies=response;
            let index=0;

            while (returnedMovies.length<numberOfmovies) {
              if (!ratedMovies.hasOwnProperty(tmdbMovies.results[index].id)) {

                returnedMovies.push(tmdbMovies.results[index].id);
              }
              index++;
              if (index===tmdbMovies.results.length-1) return movieController.survey(req,res);
            }
            return res.send(returnedMovies);
          });
        });
      });

    }else{

      return res.sendStatus(401);
    }
  });

};


module.exports=movieController;
