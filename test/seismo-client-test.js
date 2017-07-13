const {
  shakeMessage
} = require('../app/seismo-client');
const {
  seismogramFactory
} = require('./test-utils');

describe('seismo client', () => {
  it('should not shake if seismo is all zero', () => {
    const input = `I'm shaking in by sturdy boots>>>barry`;
    const expected = `I'm shaking in by sturdy boots`;
    const [res,] = shakeMessage(input, seismogramFactory(500, [0], []));
    assert.equal(res, expected);
  });
  it('should not shake if seismo is all the same', () => {
    const input = `I'm shaking in by sturdy boots>>>barry`;
    const expected = `I'm shaking in by sturdy boots`;
    const [res,] = shakeMessage(input, seismogramFactory(500, [-2], []));
    assert.equal(res, expected);
  });
  it('should return the receiver', () => {
    const input = `I'm shaking in by sturdy boots>>>barry`;
    const expected = `barry`;
    const [,res] = shakeMessage(input, seismogramFactory(500, [-2], []));
    assert.equal(res, expected);
  });
    it('should shake if seismo is active', () => {
    const input = `I'm shaking in by sturdy boots>>>barry`;
    const expected = `Im\'s hikan gni bytsu dr yboots`;
    const [res,] = shakeMessage(input, seismogramFactory(500, [-2,2,-1,1,0,0,2,1,-2,-1,0], []));
    assert.equal(res, expected);
  });
})
