import React, {useState, useEffect} from 'react';
import './App.css';
import Web3 from 'web3';
import Token from '../abis/Token.json'

function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const fetchData = async () => {
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()
    const abi = Token.abi
    const networkId = await web3.eth.net.getId()
    const networkAddress = Token.networks[networkId].address
    const token = new web3.eth.Contract(Token.abi, networkAddress)
    const totalSupply = await token.methods.totalSupply().call()
    console.log(totalSupply)
  }
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
    } else {
        console.log("No authorized account found")
    }
}

  useEffect(()=> {
    fetchData()
  })
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="/#">Navbar</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/#">Link 1</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/#">Link 2</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/#">Link 3</a>
          </li>
        </ul>
      </div>
    </nav>
    <div className="content">
      <div className="vertical-split">
        <div className="card bg-dark text-white">
          <div className="card-header">
            Card Title
          </div>
          <div className="card-body">
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="/#" className="card-link">Card link</a>
          </div>
        </div>
        <div className="card bg-dark text-white">
          <div className="card-header">
            Card Title
          </div>
          <div className="card-body">
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="/#" className="card-link">Card link</a>
          </div>
        </div>
      </div>
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">
            Card Title
          </div>
          <div className="card-body">
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="/#" className="card-link">Card link</a>
          </div>
        </div>
      </div>
      <div className="vertical-split">
        <div className="card bg-dark text-white">
          <div className="card-header">
            Card Title
          </div>
          <div className="card-body">
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="/#" className="card-link">Card link</a>
          </div>
        </div>
        <div className="card bg-dark text-white">
          <div className="card-header">
            Card Title
          </div>
          <div className="card-body">
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="/#" className="card-link">Card link</a>
          </div>
        </div>
      </div>
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">
            Card Title
          </div>
          <div className="card-body">
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="/#" className="card-link">Card link</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;