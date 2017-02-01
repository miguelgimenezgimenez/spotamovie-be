const mongoose = require('mongoose');
const UserSchema =require('../models/User');


const userController={};

userController.me=((req,res,next)=>{
  if (!req.headers.authorization) return res.sendStatus(400, 'missing authorization header');
  const token =req.headers.authorization.split(' ')[1];
  userController.getUser(token)
  .then(response=>{
    if (response.length>0) return res.send(response[0]);
    return res.sendStatus(401);
  });
});

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
      name: userInfo.display_name,
      email:userInfo.email,
      spotifyId:userInfo.id,
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
