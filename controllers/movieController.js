const request = require('request');
const raccoonController = require('./raccoonController');
const userController = require('./userController');
const UserSchema =require('../models/User');

let movieController = {};


movieController.like=(req,res)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length>0) {
      const userId=response[0].spotifyId;
      raccoonController.liked(userId,`MOVIE${req.params.movieId}`, ()=>{
        console.log('user liked');
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
      raccoonController.dislike(userId,`MOVIE${req.params.movieId}`, ()=>{
      });
      return res.sendStatus(200);
    }
    return res.sendStatus(401);

  });
};
movieController.recommendation=(req,res)=>{
  raccoonController.recommendFor(req.body.userId,1, (recs)=>{
    console.log(recs);
  });
};

module.exports=movieController;
