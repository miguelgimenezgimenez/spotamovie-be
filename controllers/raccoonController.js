const raccoon = require('raccoon');

raccoon.connect(6379, '127.0.0.1');

const raccoonController={};

raccoonController.liked = (userId, itemId, cb) => {
  raccoon.liked(userId, itemId, () => {
    cb();
  });
};

raccoonController.recommend = (req, res, cb) => {
  return raccoon.recommendFor('userId', 1, function(results){
    console.log(results);
    cb(results);
  });
};

module.exports = raccoonController;
