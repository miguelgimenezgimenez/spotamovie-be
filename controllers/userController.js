const mongoose = require('mongoose');
const UserSchema =require('../models/User');


const userController={};


userController.getUser=(id=>{
  const output={};
  return new Promise((resolve,reject)=>{
    UserSchema.find({spotifyId:id})
    .then((user,err)=>{
      return resolve(user);
    });
  });
});

userController.setToken=(id,token)=>{
  return new Promise((resolve,reject)=>{
    var options = {new: true};
    UserSchema.findOneAndUpdate({spotifyId:id},{$set:{userToken:token}},options,((err,user)=>{
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
    });
    newUser.save((err,user) => {
      if(err) {
        console.log(err);
      }
      else { //If no errors, send it back to the client
        return resolve(user);
      }
    });
  });
};
module.exports=userController;
