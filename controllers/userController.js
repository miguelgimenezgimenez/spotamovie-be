const mongoose = require('mongoose');
const UserSchema =require('../models/User');


const userController={};




userController.getUser=(token=>{
  const output={};
  return new Promise((resolve,reject)=>{
    UserSchema.find({userToken:token})
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
      name: userInfo.body.display_name,
      email:userInfo.body.email,
      spotifyId:userInfo.body.id,
      userToken:token,
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
