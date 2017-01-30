const mongoose = require('mongoose');
const UserSchema =require('../models/User');


const userController={};


userController.getUser=(id=>{
  console.log('finduser');
  UserSchema.find({spotifyId:id})
  .then((res,err)=>{
    console.log(err);
    console.log(res);
  });

});

userController.newUser=(userInfo,token)=>{
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
         console.log(user);

       }
   });



};
