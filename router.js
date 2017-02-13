const express = require('express');
const router = express.Router();
const loginController = require('./controllers/loginController');
const movieController = require('./controllers/movieController');
const userController = require('./controllers/userController');

router.get('/me', userController.me);
router.post('/login', loginController.login);
router.post('/movies/:movieId/like', movieController.like);
router.post('/movies/:movieId/dislike', movieController.dislike);
router.post('/movies/:movieId/unlike', movieController.unlike);
router.post('/movies/:movieId/undislike', movieController.undislike);
router.get('/movies/recommendation', movieController.recommendation);
router.get('/movies/survey', movieController.survey);
router.get('/movies/liked', movieController.allLikes);
router.get('/movies/disliked', movieController.alldislikes);

router.get('/', (req, res) => {
  res.send('Full documentation on the Spotamovie API available on Apiary <a href="https://jsapi.apiary.io/previews/spotamovie/reference">here</a>.');
});

module.exports = router;
