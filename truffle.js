var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "secret catalog black address dirt knock gesture board zero spray million glue want usual wisdom friend dog loop runway start announce theme lottery either";
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
"https://ropsten.infura.io/vKci4bjCOf3x7jLLQRWs")
      },
      network_id: 3
      //gas: 500000,
//price: 2,
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic,
"https://mainnet.infura.io/vKci4bjCOf3x7jLLQRWs")
      },
      network_id: 1
    }
  }
};
