const express = require('express');

const router = require('./router.js');

const app = express();

app.use(router);


app.listen(8080, function () {
  console.log('Listening on port 8080');
});
