import raccoon from 'raccoon';
raccoon.connect(6379, '127.0.0.1');

const raccoonController={};

const cb=()=>{};

raccoonController.like=(req,res)=>{
  raccoon.liked(req.userID, req.ItemId, cb);
};

raccoonController.recommend=(req,res)=>{
  raccoon.recommendFor('userId', 1, function(results){
    console.log(results);
  });
};

export default raccoonController;
