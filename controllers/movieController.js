const request = require('request');
const userController = require('./userController');
const UserSchema =require('../models/User');
const raccoon = require('raccoon');

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
  raccoon.recommendFor(req.body.userId,1, (recs)=>{
    console.log(recs);
  });
};

module.exports=movieController;
