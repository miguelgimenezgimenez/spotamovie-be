const mongoose = require('mongoose');
const UserSchema =require('../models/User');
const songController = require('./songController');

const userController={};

userController.me=((req,res,next)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];

  userController.getUser(token)
  .then(response=>{
    if ((Date.now()-response[0].loginDate)/60000>24) {
      songController.processData(response[0]);
    }
    if (response.length>0) return res.send(response[0]);
    return res.sendStatus(401);
  });
});

userController.getUser=(id=>{
  const output={};
  return new Promise((resolve,reject)=>{
    UserSchema.find({spotifyId:id})
    .then((user,err)=>{
      return resolve(user);
    });
  });
});

userController.updateUser=(id,token)=>{
  return new Promise((resolve,reject)=>{
    var options = {new: true};
    UserSchema.findOneAndUpdate({userToken:token},
      {
        $set:{
          userToken: token,
          loginDate:Date.now()
        }
      },
      options,((err,user)=>{
        return resolve(user);
      }));
    });
  };

  userController.newUser=(userInfo,token)=>{
    return new Promise((resolve,reject)=>{
      const newUser =  new UserSchema({
        name: userInfo.display_name,
        email:userInfo.email,
        spotifyId:userInfo.id,
        userToken:token,
        loginDate:Date.now(),
      });
      newUser.save((err,user) => {
        if(err) {
          console.log(err);
        }
        else {
          //If no errors, send it back to the client
          return resolve(user);
        }
      });
    });
  };
  module.exports=userController;
