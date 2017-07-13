# README

SeismoChat is an Ethereum Dapp that allows participants to send messages to each other. But the message content is shaken according to the seismic activity at 1 meter depth recorded by the seismograph positioned next to the Hornbach store in Groningen. It consists of a contract, a nodejs cli client application to send and receive messages and a nodejs microservice that retrieves the seismic activity and updates it in the Ethereum contract. 

## Installation

1. install node https://nodejs.org/en/ current > version 8
1. install truffle: ``npm i -g truffle``
1. install testrpc: ``npm i -g ethereumjs-testrpc``
1. run ``npm i`` in the directory of the dapp
1. run ``testrpc -l 4500000000 -d`` to start the test ethereum network in deterministic mode (I use static addresses for this prototype)
1. run ``truffle deploy`` to build and deploy the contract
now you are ready

## Usage

Each in a different console run
1. ``node --harmony index service``
2. ``node --harmony index client --name barry``
3. ``node --harmony index client --name mike``
3. ``node --harmony index client --name julie``

In the client consoles you can type a message followed by ``>>>barry`` (or mike or julie) and press return. The message will be sent to the other console and the text is manipulated according to the seismic activity

## Design

I initially started to implement the seismoChat service by writing an Ethereum contract that actually manipulates the message in the contract based on the seismic activity. However this is complicated, expensive and records all the messages on the blockchain because they are part of the function call. If you really want it can be done using https://github.com/Arachnid/solidity-stringutils. You cannot encrypt the message and then decrypt in the contract to manipulate, because the contract requires all input information to be on chain for validation of the output. This would include cryptographic keys.

I therefore decided to change the architecture and only use the contract to store the seismic activity and manipulate the messages in the clients that can then use the Ethereum whisper protocol to send the message. This does not guarantee the manipulation to always be done in the way intended, because the client may have been modified. You do still know where you're sending the message and that the message is encrypted.

I developed this prototype on the testrpc JSON rpc mock server that does not support the whisper protocol. Also my assignment stated that I should use a contract to enable the communication. So I changed the design again and I eventually still do the string manipulation on the client for the reasons mentioned, but I send messages between clients using a function on the contract that simply raises an event with the message, sender and receiver. Clients can easily filter out the messages meant for them. However everything is sent in the clear and recorded fully in the logs and on the blockchain. 

For further details. Please read the code. It has been commented.