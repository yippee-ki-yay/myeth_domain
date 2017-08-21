var DomainNameRegistry = artifacts.require("./DomainNameRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(DomainNameRegistry);
};
