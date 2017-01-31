process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const localAuth = require('../auth/local');

describe('auth : local', () => {
  describe('encodeToken()', () => {
    it('should return a token', (done) => {
      const results = localAuth.encodeToken('1234');
      should.exist(results);
      results.should.be.a('string');
      done();
    });
  });
  describe('decodeToken()', () => {
    it('should return a token', (done) => {
      const results = localAuth.encodeToken('1234');
      should.exist(results);
      results.should.be.a('string');
      done();
    });
  });
});
