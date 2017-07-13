const SeismoChat = artifacts.require("./SeismoChat.sol");

module.exports = function(deployer, network, accounts) {
  // sent the deployment from the address used by the seismo service
  deployer.deploy(SeismoChat, {from: accounts[0]});
};
