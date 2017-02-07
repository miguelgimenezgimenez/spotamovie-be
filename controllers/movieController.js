const request = require('request');
const userController = require('./userController');
const UserSchema =require('../models/User');
const nconf = require('../config/nconf.js');
const raccoon = require('raccoon');
const _ = require('underscore');

var jsonfile = require('jsonfile')

var file = '/tmp/data.json'

const userLikes={};
const movieController = {};
const url =`https://api.themoviedb.org/3/discover/movie?api_key=${nconf.get('TMDB_API_KEY')}`;

movieController.like=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      const movieId=req.params.movieId;
      raccoon.liked(userId,movieId ).then(()=>{
        // userId in userLikes? userLikes[userId].push(movieId):userLikes[userId]=[movieId]
        // jsonfile.writeFile(file, obj}, function(err) {
        //   console.error(err)
        // })
        console.log(userId,'liked',movieId);
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
      raccoon.disliked(userId,movieId).then(()=>{
        console.log(userId,'disliked',movieId);
      });
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  });
};

movieController.unlike=(req,res)=>{
  console.log('requestiong', ": 'requestiong'");
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      const movieId=req.params.movieId;
      raccoon.unliked(userId, movieId).then(() => {
        console.log(userId, ": userId");
      });
      return res.send(movieId);
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
      raccoon.undisliked(userId,movieId).then(()=>{
        console.log(userId,'undisliked',movieId);
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
      raccoon.allLikedFor(userId).then((results) => {
        const ratedMovies= results.filter(like =>!like.includes('SP')).slice(0,39);
        return res.send({movies:ratedMovies});
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
      raccoon.allDislikedFor(userId).then((results) => {
        const ratedMovies= results.filter(like =>!like.includes('SP')).slice(0,39);
        return res.send({movies:ratedMovies});
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
      const alreadyRecommended=response[0].alreadyRecommended;
      let movie;
      raccoon.recommendFor(userId, 100).then(rec => {
        rec=_.difference(rec,alreadyRecommended).filter(like =>!like.includes('SP'));
        if (rec.length===0) {
          let page =Math.floor(Math.random()*40+1);


          request.get(`${url}&page=${page}`, (error, response, body) => {
            let receivedMovies=JSON.parse(body).results.filter((movie) => movie.poster_path).map((movie=>movie.id.toString()));
            movieController.findRatedMovies(userId)
            .then(response=>{
              const movie=(handleMovies(receivedMovies,1,response)[0]);
              res.send({
                "movieId": movie,
              });
            });
          });
        } else {
          console.log('raccon recommendation');
          alreadyRecommended.push(rec[0]);
          userController.updateUser(userId,{alreadyRecommended:alreadyRecommended});
          return res.send({
            "movieId": rec[0],
          });
        }

      });
    }else{
      return res.sendStatus(401);
    }
  });
};

movieController.findRatedMovies=(userId)=>{
  return new Promise((resolve,reject)=>{
    raccoon.allWatchedFor(userId).then(results => {
      const ratedMovies= results.filter(like =>!like.includes('SP'));
      return resolve(ratedMovies);
    });
  });
};


const handleMovies = (moviesToBeSent,n,moviesAllreadyRecommended) =>{
  moviesToBeSent=_.difference(moviesToBeSent,moviesAllreadyRecommended);
  return moviesToBeSent.slice(0,n);
};


movieController.survey=(req,res)=>{
  let numberOfmovies=1;
  let moviesToBeSent=[];
  let ratedMovies=[];
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(user=>{
    if (user.length===0) return res.sendStatus(401);
    if(user[0].firstLogin){
      numberOfmovies=4;
    }
    const userId=user[0].spotifyId;
    userController.updateUser(userId,{firstLogin:false})
    //Handle first login
    .then(user=>{
      //======================================================
      // GET TMDB movies
      //======================================================
      let page =Math.floor(Math.random()*50+1);
      request.get(`${url}&page=${page}`, (error, response, body) => {
        let receivedMovies=JSON.parse(body).results.filter(movie => (movie.poster_path)).map(movie=>movie.id.toString())
        movieController.findRatedMovies(userId)
        .then(response=>{
          ratedMovies=response;
          moviesToBeSent=moviesToBeSent.concat(handleMovies(receivedMovies,numberOfmovies,ratedMovies));
          ratedMovies=ratedMovies.concat(moviesToBeSent);
          //GET POPULAR MOVIES
          request.get(`${url}&sort_by=popularity.desc&page=${page}`, (error, response, body) => {
            let receivedMovies=JSON.parse(body).results.filter((movie) => movie.poster_path).map((movie=>movie.id.toString()));
            moviesToBeSent=moviesToBeSent.concat(handleMovies(receivedMovies,numberOfmovies,ratedMovies));
            ratedMovies=ratedMovies.concat(moviesToBeSent);

            //GET WEIRD MOVIES
            page+=3;
            request.get(`${url}&sort_by=popularity.desc.asc&page=${page+50}`, (error, response, body) => {
              let receivedMovies=JSON.parse(body).results.filter((movie) => movie.poster_path).map((movie=>movie.id.toString()));
              moviesToBeSent=moviesToBeSent.concat(handleMovies(receivedMovies,numberOfmovies,ratedMovies));
              return res.send({movies:moviesToBeSent});
            });
          });
        });
      });
    });
  });
};


module.exports=movieController;
