import React, { Component } from 'react'
import DnsContract from '../build/contracts/DomainNameRegistry.json';
import HelloWorldContract from '../build/contracts/HelloWorld.json';
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      msg: ""
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  async instantiateContract() {

    const contract = require('truffle-contract');
    const eth = this.state.web3.eth;

    const dnsContractStorage = contract(DnsContract);
    dnsContractStorage.setProvider(this.state.web3.currentProvider);

    const instance = await dnsContractStorage.deployed();
    
    // const result = await instance.sayHi.call(eth.accounts[0]);

    // this.setState({
    //   msg: result
    // });

    await instance.registerDomain("127.0.0.1", "test.myeth", {from: eth.accounts[0]});

    const ipAddress = await instance.lookup.call("test.myeth", {from: eth.accounts[0]});


    console.log(ipAddress);

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance;

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {


    //   // simpleStorage.deployed().then((instance) => {
    //   //   simpleStorageInstance = instance

    //   //   // Stores a given value, 5 by default.
    //   //   return simpleStorageInstance.set(1894, {from: accounts[0]})
    //   // }).then((result) => {
    //   //   // Get the value from the contract to prove it worked.
    //   //   return simpleStorageInstance.get.call(accounts[0])
    //   // }).then((result) => {
    //   //   // Update state with the result.
    //   //   return this.setState({ storageValue: result.c[0] })
    //   // }).catch((err) => {
    //   //   console.log(err);
    //   // });
    // })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Domain names on the BlockChain</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Register your name</h1>
              <p>Your domain name: </p>
              <input type="text" />
              <p>Your ip address: </p>
              <input type="text" />
              <h1>Smart Contract Example</h1>
              <p>We read something from the blockchain m'lord: <b> { this.state.msg } </b> </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
