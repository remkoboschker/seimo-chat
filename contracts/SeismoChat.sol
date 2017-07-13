pragma solidity ^0.4.4;

contract SeismoChat {
  int8[500] seismo;
  address seismoService;
  event seismoUpdated(int8[500] seismo);
  // the event in indexed by the to address to allow for easy filtering in clients.
  event messagePosted(address indexed to, address from, string message);

  function SeismoChat() {
    // the seismo service is the owner of the contract
    // deployment is sent from the service address
    // this is encoded in the migrations/2_deploy_contracts file
    seismoService = msg.sender;
  }

  function setSeismo(int8[500] newSeismo) {
    require(msg.sender == seismoService );
    seismo = newSeismo;
    seismoUpdated(seismo);
  }

  function getSeismo() constant returns (int8[500]) {
    return seismo;
  }

  // post shaken only calls the event to allert clients of a new message
  // n.b. messages are encoded on the blockchain in plain text
  function postShaken(string message, address to) {
    messagePosted(to, msg.sender, message);
  }
}