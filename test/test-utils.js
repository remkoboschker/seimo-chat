function seismogramFactory(length, pattern, acc) {
  if (acc.length > length) {
    return acc.slice(0,length);
  }
  return seismogramFactory(length, pattern, acc.concat(pattern));
}

module.exports = {
  seismogramFactory
}

