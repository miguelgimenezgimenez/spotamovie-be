const nconf = require('nconf');
const path = require('path');

let fileName = 'dev.json';
if (process.env.NODE_ENV === 'test') fileName = 'test.json';

const filePath = path.resolve(__dirname, fileName);

nconf
  .argv()
  .env()
  .file({file: filePath});

module.exports = nconf;
