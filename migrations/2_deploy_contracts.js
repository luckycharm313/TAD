var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var DD = artifacts.require("./DD.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(DD);
};
