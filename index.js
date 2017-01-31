const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');

const db=require('./db');
const router = require('./router.js');

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(router);


app.listen(8888, function () {
  console.log('Listening on port 8888');
});


module.exports = app; // for testing
