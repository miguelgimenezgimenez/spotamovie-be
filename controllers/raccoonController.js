const raccoon = require('raccoon');
raccoon.config.className = 'spotamovie';
// raccoon.connect(6379, '127.0.0.1');

const raccoonController={};

raccoonController.liked = (userId, itemId, cb) => {
  raccoon.liked(userId, itemId, () => {
    cb();
  });
};
raccoonController.dislike = (userId, itemId, cb) => {
  raccoon.liked(userId, itemId, () => {
    cb();
  });
};

raccoonController.recommend = (req, res, cb) => {
  return raccoon.recommendFor('userId', 1, function(results){
    cb(results);
  });
};

module.exports = raccoonController;
