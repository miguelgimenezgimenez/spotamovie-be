const bcrypt = require('bcrypt');
const saltRounds = 10;

const encode =(token)=>{
  return new Promise((resolve,reject) => {
    bcrypt.hash(token, saltRounds, function(err, hash) {
      return resolve(hash);
    });
  });
};
