const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//book schema definition
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userToken: { type: String, required: false },
    spotifyId: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
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
