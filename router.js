const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello world');
});


router.post('/signin/spotify', (req,res,next)=>{


  

});
module.exports = router;
