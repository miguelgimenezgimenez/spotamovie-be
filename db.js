const mongoose = require('mongoose');
const nconf = require('./config/nconf');
const raccoon = require('raccoon');
raccoon.connect(6379, '127.0.0.1');

let options = {
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
              };

mongoose.connect(nconf.get('DBHost'));
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.log('Connected to the db');
});

module.exports = db;
