pragma solidity ^0.4.4;

contract SeismoChat {
  int8[500] seismo;
  address seismoService;
  event seismoUpdated(int8[500] seismo);

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
}
//21533172