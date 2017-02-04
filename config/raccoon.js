'use strict';

const raccoon = require('raccoon');
const nconf = require('./nconf.js');

const REDIS_URL = nconf.get('REDIS_URL') || "//127.0.0.1:6379";

let client = require('redis').createClient(REDIS_URL);
raccoon.setClient(client);

module.exports = raccoon;
