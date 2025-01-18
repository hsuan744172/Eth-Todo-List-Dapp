module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
      
    }
  },
  solc: {
    version: "0.8.20",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
