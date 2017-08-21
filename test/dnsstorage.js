var DnsStorage = artifacts.require("./DomainNameRegistry.sol");

contract('DnsStorage', function(accounts) {

  it("...should register a new domain name for the address", function() {
    return DnsStorage.deployed().then(function(instance) {
      instance.registerDomain("127.0.0.6", "testdmain.myeth", {from: accounts[0]})
      .then(function(resp) {

           let ip = instance.lookup.call("testdmain.myeth", accounts[0]);

           ip.then(function(value) {
              console.log("Value: " + value);
           });

          //  ip.then(function(address) {
          //   console.log(address)
          //  });

          // assert.equal(ip, "127.0.0.1", "Lookup a domain");
      });

    });
  });

});
