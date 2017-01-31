process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const bcrypt = require('../auth/bcrypt');

describe('auth : local', () => {
  describe('encodeToken()', () => {
    it('should return a token', (done) => {
      bcrypt.encode('12345')
      .then(response=>{
        const results = response;
        should.exist(results);
        results.should.be.a('string');
        done();
      })
    });
  });
  describe('decodeToken()', () => {
    it('should return a token', (done) => {
      bcrypt.encode('12345')
      .then(response=>{
        bcrypt.compare('1234', response, function(err, res) {
          expect(res).to.be.true;
          done();

        });
      });
    })
  });
});
