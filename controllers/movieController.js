const request = require('request');
const raccoonController = require('./raccoonController');
// const localAuth = require('../auth/local');
const UserSchema =require('../models/User');



let movieController = {};


movieController.like=(req,res)=>{
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    console.log(response);
    if (response.length>0) {
      const userId=response[0].spotifyId;
      raccoonController.liked(userId,`MOVIE${req.params.movieId}`, ()=>{
      console.log(userId, 'liked', req.params.movieId);
      });

    }

  });
};

movieController.disliked=(req,res)=>{
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    const userId=response[0].spotifyId;
    raccoonController.disliked(userId,`MOVIE${req.params.movieId}`, ()=>{
    console.log(userId, 'liked', req.params.movieId);
    });
  });
};
movieController.recommendation=(req,res)=>{
  raccoonController.recommendFor(req.body.userId,1, (recs)=>{
    console.log(recs);
  });
};

module.exports=movieController;
