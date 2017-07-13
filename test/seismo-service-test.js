const {
  makeRequests,
  getSeismo,
  parseSeismogram,
  getOrDeployContractInstance
} = require('../app/seismo-service');
const {
  seismogramFactory
} = require('./test-utils');
const sinon = require('sinon');
sinon.assert.expose(assert, { prefix: "" });

describe('seismo service', () => {
  before(() => {
    this.clock = sinon.useFakeTimers();
  });

  after(() => {
    this.clock.restore();
  });

  // there is an issue with this test, but I have not found out what's going on
  it('should request data and update contract every interval', (done) => {
    const getSpy = sinon.stub().resolves('seismo');
    const put = sinon.stub().resolves('tx_id');
    const intervalId = makeRequests(getSpy, put, 10)
    this.clock.tick(25);
    assert.calledTwice(getSpy);
    assert.calledTwice(put);
    clearInterval(intervalId);
    done()
  });

  it('should continue if a request fails, but not update contract', (done) => {
    const getSpy = sinon.stub().rejects();
    const put = sinon.stub().resolves('tx_id');
    const intervalId = makeRequests(getSpy, put, 10);
    this.clock.tick(25);
    assert.calledTwice(getSpy);
    assert.notCalled(put);
    clearInterval(intervalId);
    done()
  });

  it('should convert the seismogram to a 5 value scale', () => {
    const expected = seismogramFactory(500, [-2,-1,0,0,1,2], []);
    const result = parseSeismogram(
      seismogramFactory(600, [-200, -100, -10, 10, 100, 200], []));
    assert.deepEqual(expected, result);
  });

  it('should use the first five hundred elements of the seismogram', () => {
    const result = parseSeismogram(
      seismogramFactory(600, [-200, -100, -10, 10, 100, 200], []));
    assert.equal(result.length, 500);
  });

  it('should throw an error if there are less than 500 measurements', () => {
    assert.throws(() => { parseSeismogram(
      seismogramFactory(450, [-200, -100, -10, 10, 100, 200], [])) },
      'seismogram to short'
    );
  });
});