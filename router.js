const express = require('express');
const router = express.Router();
const Buffer = require('buffer/').Buffer;
const request = require('request');
const loginController = require('./controllers/loginController');
const movieController = require('./controllers/movieController');
const userController = require('./controllers/userController');

router.get('/me', userController.me);
router.post('/login', loginController.login);
router.post('/movies/:movieId/like', movieController.like);
router.post('/movies/:movieId/dislike', movieController.dislike);
router.post('/movies/:movieId/unlike', movieController.like);
router.post('/movies/:movieId/undislike', movieController.dislike);
router.get('/movies/recommendation', movieController.recommendation);
router.get('/movies/survey', movieController.survey);
router.get('/movies/liked', movieController.allLikes);
router.get('/movies/disliked', movieController.alldislikes);

module.exports = router;
