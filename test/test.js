process.env.NODE_ENV = 'test';

var server = require('../index');

describe('server', function () {
  before(function () {
    server.listen(8000);
  });

  after(function () {
    server.close();
  });
});
