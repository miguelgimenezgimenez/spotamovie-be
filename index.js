const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router.js');

const app = express();

// app.use(bodyParser);
app.use(bodyParser.json());

app.use(router);


app.listen(8888, function () {
  console.log('Listening on port 8888');
});
