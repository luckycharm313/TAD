var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "inner fitness giraffe brand festival devote legend victory small ribbon tree friend";

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic,
          "https://ropsten.infura.io/v3/3b60a5f5d79c44fb87064ef9b9fcea5e")
      },
      network_id: 3,
      gas: 3000000,
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic,
          "https://mainnet.infura.io/v3/3b60a5f5d79c44fb87064ef9b9fcea5e")
      },
      network_id: 1
    }
  }
};