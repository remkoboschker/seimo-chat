const SeismoChat = artifacts.require("./SeismoChat.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SeismoChat, {from: accounts[0]});
};
