module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 10000000 // I increased the available gas to avoid issues
    }
  }
};
