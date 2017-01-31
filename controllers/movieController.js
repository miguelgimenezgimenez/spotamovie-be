const request = require('request');
const raccoonController = require('./raccoonController');
const localAuth = require('../auth/local');



let movieController = {};


movieController.like=(req,res)=>{
console.log(req.headers);
  // raccoonController.liked(req.body.userId,`MOVIE${req.params.movieId}`, ()=>{

    // console.log(req.body.userId, 'liked', req.params.movieId);
  // });
};

movieController.disliked=(req,res)=>{
  raccoonController.liked(`MOVIE${req.params.movieId}`, req.body.userId, ()=>{
    console.log(req.body.userId, 'liked', req.params.movieId);
  });
};
movieController.recommendation=(req,res)=>{
  raccoonController.recommendFor(req.body.userId,1, (recs)=>{
    console.log(recs);
  });
};

module.exports=movieController;
