var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var DD = artifacts.require("./DD.sol");
var DreamDollar = artifacts.require("./DreamDollar.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(DD);
  //deployer.deploy(DreamDollar);
};
