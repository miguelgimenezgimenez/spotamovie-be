const mongoose = require('mongoose');
const UserSchema =require('../models/User');
const songController = require('./songController');

const userController={};

userController.me=((req,res,next)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  UserSchema.find({userToken:token})
  .then(response=>{
    if (response.length===0) {
      return res.sendStatus(401, 'user Not found');
    }
    if (((Date.now()-response[0].loginDate)/60000)>24) {
      return res.sendStatus(401, 'token expired');
    }
    if (response.length>0) return res.send(response[0]);
  });
});

userController.updateUser=(id,updateKey)=>{
  return new Promise((resolve,reject)=>{
    var options = {new: true};
    const newValue=Object.assign({},updateKey,{loginDate:Date.now()});

    UserSchema.findOneAndUpdate({spotifyId:id},
      {
        $set:newValue
      },
      options,((err,user)=>{
        return resolve(user);
      }));
    });
  };

  userController.newUser=(userInfo,token)=>{
    return new Promise((resolve,reject)=>{
      const newUser =  new UserSchema({
        name: userInfo.body.display_name,
        email:userInfo.body.email,
        spotifyId:userInfo.body.id,
        userToken:token,
        loginDate:Date.now(),
      });
      newUser.save((err,user) => {
        if(err) {
          console.log(err);
          reject(err);
        }
        else {
          //If no errors, send it back to the client
          return resolve(user);
        }
      });
    });
  };
  module.exports=userController;
