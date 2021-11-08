import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const meme = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Flor 💮 and I work for FlureeDB, its a graph database with a blockchain, but on my free time I like to learn about web3. Connect your Ethereum wallet and send me a funny meme!
        </div>

        <button className="waveButton" onClick={meme}>
          Send a meme!
        </button>
      </div>
    </div>
  );
}
