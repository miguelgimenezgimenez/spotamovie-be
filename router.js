const express = require('express');
const router = express.Router();
const Buffer = require('buffer/').Buffer;
const request = require('request');
const raccoon = require('./controllers/raccoonController');
const loginController = require('./controllers/loginController');

router.post('/login', loginController.login);

module.exports = router;
