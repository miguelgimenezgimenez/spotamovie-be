const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//book schema definition
const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    userToken: { type: String, required: true },
    spotifyId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    loginDate: {type:Number,required:true},
    firstLogin:{type:Boolean, default:false},
    alreadyRecommended:{type:Array, require: false}
  }
);

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', next => {
  const now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('User', UserSchema);
