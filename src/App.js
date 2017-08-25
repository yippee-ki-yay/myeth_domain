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

    //grab the contract deployed on the main net
    const instance = dnsContract.at("0x8dCe58B0f1D03585f8F0458F65A5132fb92bfdcb");

    // const instance = await dnsContract.deployed();

    this.setState({
      contractInstance: instance
    });

    // await instance.registerDomain("127.0.0.1", "test.myeth", {from: eth.accounts[0]});

    // const ipAddress = await instance.lookup.call("test.myeth", {from: eth.accounts[0]});

  }

  searchDomain = async () => {

    const contract = this.state.contractInstance;
    const account = this.state.web3.eth.accounts[0];

    const ipAddress = await contract.lookup.call(this.state.query, account);

    if(ipAddress) {
      window.open("http://" + ipAddress, "_blank");
    } else {
      console.error("Domain name not found");
    }

    this.setState({
      query: ""
    });

  }

  registerDomain = async () => {

    const contract = this.state.contractInstance;
    const ipAddress = this.state.ipAddress;
    const domainName = this.state.domainName;
    const account = this.state.web3.eth.accounts[0];

    if(ipAddress || domainName) {

      await contract.registerDomain(ipAddress, domainName, {from: account});

      console.log("Domain is registered");

      this.setState({
        ipAddress : "",
        domainName : ""
      });
    }
    
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

              <div>
                <h1 className="search-box search-name">Search domain name</h1>

                <div>
                  <input className="search-input" type="text" name="query" placeholder="Try test.myeth" value={ this.state.query } onChange={ this.handleChange }/>
                  <button className="search-btn" onClick={ this.searchDomain }>Search Domain</button>
                </div>

              </div>

              <div className="register-box">
                <h4>Register a new name</h4>
                <div className="reg-box">
                  <p className="domain-text">Your domain name: </p>
                  <input type="text" name="domainName" value={ this.state.domainName } onChange={ this.handleChange } />
                  <p className="ip-text">Your ip address: </p>
                  <input type="text" name="ipAddress" value={ this.state.ipAddress } onChange={ this.handleChange } />
                  <div className="reg-div">
                    <button className="reg-btn" onClick={ this.registerDomain }>Register Domain</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
