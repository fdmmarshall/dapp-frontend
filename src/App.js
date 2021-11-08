import * as React from "react";
import { ethers } from "ethers";  // eslint-disable-next-line
import './App.css';

export default function App() {

  const meme = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header m-2">
        👋 Hey there!
        </div>

        <div className="font-mono text-center">
        I am Flor 💮, I work for FlureeDB, its a graph database with a blockchain, but on my free time I like to learn about web3. Connect your Ethereum wallet and send me a funny meme!
        </div>

        <button className="m-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={meme}>
          Send a meme!
        </button>
      </div>
    </div>
  );
}
