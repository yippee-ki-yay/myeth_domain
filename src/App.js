import React, { Component } from 'react'
import DnsContract from '../build/contracts/DomainNameRegistry.json';
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
      domainName: "",
      ipAddress: "",
      query: "",
      contractInstance: null
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

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  async instantiateContract() {

    const contract = require('truffle-contract');
    const eth = this.state.web3.eth;

    const dnsContract = contract(DnsContract);
    dnsContract.setProvider(this.state.web3.currentProvider);

    const instance = await dnsContract.deployed();

    this.setState({
      contractInstance: instance
    });

    await instance.registerDomain("127.0.0.1", "test.myeth", {from: eth.accounts[0]});

    const ipAddress = await instance.lookup.call("test.myeth", {from: eth.accounts[0]});

    console.log(ipAddress);

  }

  searchDomain = async () => {

    const contract = this.state.contractInstance;
    const account = this.state.web3.eth.accounts[0];

    const ipAddress = await contract.lookup.call(this.state.query, account);

    if(ipAddress) {
      window.open("http://" + ipAddress, "_blank");
    }

    this.setState({
      query: ""
    });

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
              <input type="text" name="domainName" value={ this.state.domainName } onChange={ this.handleChange } />
              <p>Your ip address: </p>
              <input type="text" name="ipAddress" value={ this.state.ipAddress } onChange={ this.handleChange } />
              <button>Register Domain</button>

              <h1>Search domain name</h1>
              <input type="text" name="query" value={ this.state.query } onChange={ this.handleChange }/>
              <button onClick={ this.searchDomain }>Search Domain</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
