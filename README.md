# README

SeismoChat is a communication technology that allows participants to send messages to each other. But the message content is shaken according to the seismic activity at 1 meter depth recorded by the seismograph positioned next to the Hornbach store in Groningen. The client application is a simple command line application running on Node.js.

## Installation

install node https://nodejs.org/en/ current > version 8
install truffle: ``npm i -g truffle``
install testrpc: ``npm i -g ethereumjs-testrpc``
run ``npm i`` in the directory of the dapp
run ``testrpc -l 4500000000 -d`` to start the test ethereum network
run ``truffle deploy`` to build and deploy the contract
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

So now a service collects and pre-processes the seismic activity from an online resource (http://rdsa.knmi.nl/fdsnws/dataselect/1/queryauth) and converts it to an array of five hundred values on a five value scale. These values are stored on the blockchain. The chat clients retrieve and use the values to manipulate the message entered by the user before it is encrypted and sent to another user.


The testrpc does not support whisper, I decided to allow all messages to be recorded. Clients retrieve message via the logs