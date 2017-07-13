const {
  runService
} = require('./seismo-service');
const commandlineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands')

const validCommands = [ null, 'service', 'client' ]
const { command, argv } = commandLineCommands(validCommands)

const optionDefinitions = [

];
const options = commandlineArgs(optionDefinitions, { argv });

// accounts are set when testrpc is called with -d flag
const accounts = {
  service: '90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
  barry: 'ffcf8fdee72ac11b5c542428b35eef5769c409f0',
  mike: '22d491bde2303f2f43325b2108d26f1eaba1e32b',
  julie: 'e11ba2b4d45eaed5996cd0823791e0c93114882d'
}

module.exports = (providerUrl) => {
  const Web3 = require('web3');
  const contract = require('truffle-contract');

  //const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  const provider = new Web3.providers.HttpProvider(providerUrl);
  const seismoChatContract = contract(require('../build/contracts/SeismoChat.json'));
  seismoChatContract.setProvider(provider);

  if(command === null || command === 'client') {

  }
  if(command === 'service') {
    runService(seismoChatContract, accounts.service);
  }
}
