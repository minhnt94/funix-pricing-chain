var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Main = artifacts.require("./Main.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Main);
};
