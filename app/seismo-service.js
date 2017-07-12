const request = require('request-promise-native');
const seis = require('seisplotjs-miniseed');
const Web3 = require('web3');
const contract = require('truffle-contract');

//const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const seismoChatContract = contract(require('../build/contracts/SeismoChat.json'));

async function getOrDeployContractInstance(contract, provider) {
  contract.setProvider(provider);
  try {
    return await contract.deployed();
  } catch (e) {
    process.stdout.write(e.message);
    try {
      return await contract.new();
    } catch (e) {
      process.stdout.write(e.message);
      process.exit(1);
    }
  }
} 

const seismoChat = getOrDeployContractInstance(seismoChatContract, provider);

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
  const records = await getRecords()
  const byChannel = seis.byChannel(records);
  const seismogram = seis.createSeismogram(byChannel['NL.G321..HHZ']);
  return parseSeismogram(seismogram.y());
}

async function putSeismo() {

}

function makeRequests(get, put, interval) {
  setInterval(async function() {
    try {
      const seismo = await get();
      await put(seismo);
    } catch (e) {
      process.stdout.write(e);
    }
  }, interval);
}

module.exports = {
  makeRequests,
  getSeismo,
  putSeismo,
  parseSeismogram,
  getOrDeployContractInstance
}