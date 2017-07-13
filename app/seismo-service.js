const request = require('request-promise-native');
const seis = require('seisplotjs-miniseed');

async function getRecords() {
  const end = new Date();
  const start = new Date(end.valueOf() - 500000);
  const data = await request({
    url: 'http://rdsa.knmi.nl/fdsnws/dataselect/1/queryauth',
    qs: {
      'starttime': '2016-12-23T14:29:00',//start.toISOString(),
      'endtime':  '2016-12-23T14:32:00',//end.toISOString(),
      'network': 'NL',
      'station': 'G321',
      'channel': 'HHZ',
      'nodata': '404'
    },
    'auth': {
      'user': 'r.boschker@student.rug.nl',
      'pass': '',
      'sendImmediately': false
    },
    encoding: null
  });
  const records = seis.parseDataRecords(data.buffer);
  return records;
}

function parseSeismogram(seismogram) {
  if (seismogram.length < 500) {
    throw new Error('seismogram to short')
  }
  
  return seismogram
  .slice(0,500)
  .map(y => {
    if (y > 150) {
      return 2;
    }
    if (y > 50) {
      return 1;
    }
    if (y < -150) {
      return -2;
    }
    if (y < -50) {
      return -1;
    }
    return 0;
  });
}

async function getSeismo() {
  process.stdout.write(`${new Date().toISOString()} getting seismic data\n`);
  const records = await getRecords()
  process.stdout.write(`${new Date().toISOString()} received seismic data\n`);
  const byChannel = seis.byChannel(records);
  const seismogram = seis.createSeismogram(byChannel['NL.G321..HHZ']);
  return parseSeismogram(seismogram.y());
}

function makeRequests(get, put, interval) {
  return setInterval(async function() {
    try {
      const seismo = await get();
      process.stdout.write(`${new Date().toISOString()} parsed seismic data\n`);
      const tx = await put(seismo);
      process.stdout.write(`${new Date().toISOString()} updated contract ${tx.tx}\n`);
    } catch (e) {
      process.stdout.write(`makeRequest: ${e.message}\n`);
    }
  }, interval);
}

function PutSeismo(contractInstance, serviceAddress) {
  return function put (seismo) {
    return contractInstance.setSeismo(seismo, { from: serviceAddress, gas: 4712388});
  }
}

async function runService(contract, address) {
  try {
    const contractInstance = await contract.deployed();
    makeRequests(getSeismo, PutSeismo(contractInstance, address), 50000);
  } catch (e) {
    process.stdout.write(`runService: ${e.message}`);
    process.exit(1);
  }
}

module.exports = {
  makeRequests,
  getSeismo,
  PutSeismo,
  parseSeismogram,
  runService
}