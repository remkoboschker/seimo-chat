// returns an array containing a repetition of the seismic activity representation
// of the length of the message
function seismoOfLength(length, pattern, acc) {
  if (acc.length > length) {
    return acc.slice(0,length);
  }
  return seismoOfLength(length, pattern, acc.concat(pattern));
}

// returns a manipulation of the message where letters are moved forward or backward
// in accordance with the seismic activity. The activity is modelled by an integer value
// between -2 and 2.
function shakeMessage(input, seismo) {
  // remove end of line and split on receiver marking
  const [message, receiver] = input.slice(0,-1).split(/>>/);
  // get transposition array of the right length
  const seismoLen = seismoOfLength(message.length, seismo, seismo);
  // convert message to array and place letters on new position based on the transposition
  // array. Positions are moved up by two first to allow for moved left by two (trans -2) and
  // then the transposition is added. Array is sorted by position and whitespace trimmed.
  const shaken = Array
    .from(message)
    .map((val, idx) => [val, idx + 2 + seismoLen[idx]])
    .sort((a,b) => a[1] - b[1])
    .map(a => a[0])
    .join('')
    .trim();
  return [shaken, receiver];
}

async function runClient(contract, name, accounts) {
  try {
    // setup contract, address and initial seismo value
    const contractInstance = await contract.deployed();
    const myAddress = accounts[name];
    let seismo = await contractInstance.getSeismo({ from: myAddress, gas: 4712388 })
    
    // respond to seismo updated event by updating seismo value
    contractInstance.seismoUpdated((err, res) => {
      if (err) {
        process.stdout.write(`Error: ${err.message}\n`)
      } else {
        seismo = res.args.seismo.map(x => x.toNumber());
      }
    });

    // respond to a message addressed at client by writing it to the std out.
    // the web3 event listener can filter on event argument values.
    contractInstance.messagePosted({ to: myAddress }, (err, res) => {
      if (err) {
        process.stdout.write(`Error: ${err.message}\n`)
      } else {
        // get name from address
        nameFrom = Object.entries(accounts).filter(e => e[1] === res.args.from)[0][0];
        process.stdout.write(`from: ${nameFrom}\nmessage: ${res.args.message}\n`);
      } 
    })

    // setup listening to the std in, when a text is followed by a newline
    // the reciever is parsed out and the message text shaken up
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', async () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        const [shaken, receiver] = shakeMessage(chunk, seismo);
        // you may not send a message to your self
        if (receiver === name) {
          process.stdout.write(`Poor you, have you only yourself to send a message to?\n`);
        // you may not send a message to an address that is not known
        } else if (!Object.keys(accounts).includes(receiver)) {
          process.stdout.write(`Receiver is unknown\n`);
        } else {
          // make a transaction to the seismo chat contract function postShaken
          const tx = await contractInstance.postShaken(
            shaken,
            accounts[receiver],
            {from: myAddress, gas: 4712388 });
          process.stdout.write(`tx: ${tx.tx}\nto: ${receiver}\nmessage: ${shaken}\n`);
        }
      }
    });
  } catch (e) {
    process.stdout.write(`runService: ${e.message}`);
    process.exit(1);
  }
}

module.exports = {
  shakeMessage,
  runClient
}