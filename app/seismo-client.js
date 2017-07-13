function seismoOfLength(length, pattern, acc) {
  if (acc.length > length) {
    return acc.slice(0,length);
  }
  return seismoOfLength(length, pattern, acc.concat(pattern));
}

function shakeMessage(input, seismo) {
  // remove end of line and split on receiver marking
  const [message, receiver] = input.slice(0,-1).split(/>>/);
  const seismoLen = seismoOfLength(message.length, seismo, seismo);
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
    const contractInstance = await contract.deployed();
    const myAddress = accounts[name];
    let seismo = await contractInstance.getSeismo({ from: myAddress, gas: 4712388 })
    
    contractInstance.seismoUpdated((err, res) => {
      if (err) {
        process.stdout.write(`Error: ${err.message}\n`)
      } else {
        seismo = res.args.seismo.map(x => x.toNumber());
      }
    });

    contractInstance.messagePosted({ to: myAddress }, (err, res) => {
      if (err) {
        process.stdout.write(`Error: ${err.message}\n`)
      } else {
        // get name from address
        nameFrom = Object.entries(accounts).filter(e => e[1] === res.args.from)[0][0];
        process.stdout.write(`from: ${nameFrom}\nmessage: ${res.args.message}\n`);
      } 
    })

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', async () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        const [shaken, receiver] = shakeMessage(chunk, seismo);
        if (receiver === name) {
          process.stdout.write(`Poor you, have you only yourself to send a message to?\n`);
        } else if (!Object.keys(accounts).includes(receiver)) {
          process.stdout.write(`Receiver is unknown\n`);
        } else {
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