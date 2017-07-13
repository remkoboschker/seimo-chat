// The service mode starts a micro service that retrieves seismic activity data 
// from a webservice and store a representation of this activity on the blockchain.

// The client mode starts a cli client where you can send and receive messages to
// other clients. The messages are shaken up according to the seismic activity. Message
// are public and stored on the blockchain.

const { runService } = require('./seismo-service');
const { runClient } = require('./seismo-client');
const commandlineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands')

// setup the parsing of command line arguments and commands
const validCommands = [ null, 'service', 'client' ]
const { command, argv } = commandLineCommands(validCommands)
const optionDefinitions = [
  { name: 'name', alias: 'n', type: String }
];
const options = commandlineArgs(optionDefinitions, { argv });

// accounts are set when testrpc is called with -d flag
// in a real chat application some identity management is required
const accounts = {
  service: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
  barry: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
  mike: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
  julie: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d'
}

module.exports = (providerUrl) => {
  const Web3 = require('web3');
  const contract = require('truffle-contract');

  // setup the truffle contract abstraction
  const provider = new Web3.providers.HttpProvider(providerUrl);
  const seismoChatContract = contract(require('../build/contracts/SeismoChat.json'));
  seismoChatContract.setProvider(provider);

  // running in client mode
  if(command === null || command === 'client') {
    // name argument is required in client mode
    if( options.name && accounts[options.name] ) {
      runClient(seismoChatContract, options.name, accounts)
    } else {
      process.stdout.write('you need to specify a valid account name using --name [name]\n');
      process.exit(1);
    }
  }
  // running in service mode
  if(command === 'service') {
    runService(seismoChatContract, accounts.service);
  }
}
