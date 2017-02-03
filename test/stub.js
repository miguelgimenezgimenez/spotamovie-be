const sinon = require('sinon');

const createStub = (obj, funcName, expectedResult) => {
  return sinon.stub(obj, funcName)
        .returns(new Promise(resolve => {
          resolve(expectedResult);
        }));
};

module.exports = createStub;
