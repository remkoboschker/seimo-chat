pragma solidity ^0.4.4;

contract SeismoChat {
  int8[500] seismo;
  address seismoService;
  event seismoUpdated(int8[500] seismo);
  event messagePosted(address indexed to, address from, string message);

  function SeismoChat() {
    // the seismo service is the owner of the contract
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

  function postShaken(string message, address to) {
    messagePosted(to, msg.sender, message);
  }
}
//21533172