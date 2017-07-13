// the service request data from seismographic network of the 
// Royal Dutch Meteorological Institute. The data is from station
// G321 located at the Hornbach store in Groningen. It reports seismic
// movements at one meter depth. The data returned is in the miniseed format.
// The format is parsed using https://github.com/crotwell/seisplotjs-miniseed.
// At a set interval the request is made, the data parsed, mapped on a five value
// representation and stored on the blockchain via the seismo chat contract.

const request = require('request-promise-native');
const seis = require('seisplotjs-miniseed');

// makes the request for seismic data and parses it into an interal model
// defined here https://github.com/crotwell/seisplotjs-model
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

// maps the values from the seismogram onto a five value representation
// if the seismogram is shorten than 500 values, the function raises an error
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

// requests data, extracts measurement values and calls mapping
async function getSeismo() {
  process.stdout.write(`${new Date().toISOString()} getting seismic data\n`);
  const records = await getRecords()
  process.stdout.write(`${new Date().toISOString()} received seismic data\n`);
  const byChannel = seis.byChannel(records);
  const seismogram = seis.createSeismogram(byChannel['NL.G321..HHZ']);
  return parseSeismogram(seismogram.y());
}
 // gets the values and puts them somewhere at a regular interval
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

// closes over the contract and address and returns a function calls the 
// contract to store the seismo values
function PutSeismo(contractInstance, serviceAddress) {
  return function put (seismo) {
    return contractInstance.setSeismo(seismo, { from: serviceAddress, gas: 4712388});
  }
}

// set sup the contract instance and starts the requesting
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