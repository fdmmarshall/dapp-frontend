import React, { useEffect, useState } from "react";
//import { ethers } from "ethers";  // eslint-disable-next-line
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
  try { const { ethereum } = window;
    
    if (!ethereum) {
      console.log('Make sure you have Metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }
  

  const accounts = await ethereum.request({method: 'eth_accounts'});

  if (accounts.length !== 0){
    const account = account[0];
    console.log('Found an authorized account:', account);
    setCurrentAccount(account)
  } else {
    console.log("No authorized account found") 
    }
  } catch (error) {
    console.log(error);
  }
}

const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]); 
  } catch (error) {
    console.log(error)
  }
}


  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const meme = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header m-2">
        👋 Hey there!
        </div>

        <div className="font-mono text-center">
        I'm a software developer, in my free time I like to learn about web3. I like a good laugh, so please send me a meme!
        </div>

        <button className="m-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={meme}>
          Send a meme!
        </button>
      {!currentAccount && (
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={connectWallet}>
          Connet Wallet
        </button>
      )} 

      </div>
    </div>
  );
}


export default App;