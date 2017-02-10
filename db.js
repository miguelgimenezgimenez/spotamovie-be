const mongoose = require('mongoose');
const nconf = require('./config/nconf');

mongoose.connect(nconf.get('MONGODB_URI'));
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.log('Connected to the db');
});

module.exports = db;
