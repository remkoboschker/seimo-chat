const SeismoChat = artifacts.require('./SeismoChat.sol');

function seismoFactory() {
  const vals = [-2,-1,0,1,2];
  let res = []
  for(var i = 0; i < 100; i = i + 1) {
    res = res.concat(vals);
  }
  return res;
}

contract('SeismoChat', accounts => {
  it('should set the seismo values', async () => {
    const instance = await SeismoChat.deployed();
    const seismo = seismoFactory();

    await instance.setSeismo(seismo, {
      from: accounts[0]
    })

    const seismoSetBig = await instance.getSeismo();
    const seismoSet = seismoSetBig.map(x => x.toNumber());
    assert.deepEqual(seismoSet, seismo);
  });
  it('should not set the values when the service is not the owner', async () => {
    const instance = await SeismoChat.deployed();
    try {
      await instance.setSeismo( {
        from: accounts[1]
      });
    } catch (e) {
      assert(e);
    }
  });
  it('should raise an event on update', async () => {
    const instance = await SeismoChat.deployed();
    const seismo = seismoFactory();
    //console.log(instance);
    const seismoUpdatedEvent = instance.seismoUpdated(
      (error, result) => {
        if (error) {
          throw error;
        }
        assert.deepEqual(result.args.seismo.map(x => x.toNumber()), seismo);
      }
    );
    await instance.setSeismo(seismo, {
      from: accounts[0]
    })
  });
});