require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4000000
    }
  },
  rinkeby: {
    host: "localhost", // Connect to geth on the specified
    port: 8545,
    network_id: 4,
    gas: 4000000 // Gas limit used for deploys
  }
}
