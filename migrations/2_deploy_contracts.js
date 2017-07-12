const SeismoChat = artifacts.require("./SeismoChat.sol");

module.exports = function(deployer) {
  deployer.deploy(SeismoChat);
};
