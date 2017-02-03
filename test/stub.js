const sinon = require('sinon');

const Stub = {};

Stub.createStub = (obj, funcName, expectedResult) => {
  return sinon.stub(obj, funcName)
        .returns(new Promise(resolve => {
          resolve(expectedResult);
        }));
};

Stub.removeStub = (stub) => {
  stub.restore();
};

module.exports = Stub;
