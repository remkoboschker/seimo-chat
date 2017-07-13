const { runService } = require('./seismo-service');
const { runClient } = require('./seismo-client');
const commandlineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands')

const validCommands = [ null, 'service', 'client' ]
const { command, argv } = commandLineCommands(validCommands)

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String }
];
const options = commandlineArgs(optionDefinitions, { argv });

// accounts are set when testrpc is called with -d flag
const accounts = {
  service: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
  barry: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
  mike: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
  julie: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d'
}

module.exports = (providerUrl) => {
  const Web3 = require('web3');
  const contract = require('truffle-contract');

  //const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  const provider = new Web3.providers.HttpProvider(providerUrl);
  const seismoChatContract = contract(require('../build/contracts/SeismoChat.json'));
  seismoChatContract.setProvider(provider);

  if(command === null || command === 'client') {
    if( options.name && accounts[options.name] ) {
      runClient(seismoChatContract, options.name, accounts)
    } else {
      process.stdout.write('you need to specify a valid account name using --name [name]\n');
      process.exit(1);
    }
  }
  if(command === 'service') {
    runService(seismoChatContract, accounts.service);
  }
}
