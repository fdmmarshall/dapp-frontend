import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ImageUploading from 'react-images-upload';
import ProfileSection from './components/ProfileSection';
import abi from './utils/MemePortal.json';
import { create } from 'ipfs-http-client';
import './App.css';

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

const App = (props) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [picture, setPicture] = useState(null);
  const [fileUrl, setFileUrl] = useState([]);

  const captureFile = async (pictures) => {
    const data = pictures[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setPicture(Buffer(reader.result));
    };
    try {
      const created = await client.add(pictures, { pin: true });
      const url = `http://ipfs.infura.io/ipfs/${created.path}`;
      setFileUrl((prev) => [...prev, url]);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  const [allMemes, setAllMemes] = useState([]);
  const contractAddress = '0xc5B3886814dF3308dd29fA576d45de6fEf4504d2';

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have Metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
        getAllMemes();
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMemes = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const memes = await memePortalContract.getAllMemes();

        const memesCleaned = [];
        memes.forEach((meme) => {
          memesCleaned.push({
            address: meme.memer,
            timestamp: new Date(meme.timestamp * 1000),
            fileUrl: meme.ipfsFileUrl,
          });
        });

        setAllMemes(memesCleaned);
        console.log(meme);
        console.log(allMemes);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const meme = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await memePortalContract.getTotalMemes();
        console.log('Retrieved total meme count...', count.toNumber());

        const memeTxn = await memePortalContract.sendMeme(
          'https://bafybeihko3uz7xx7ryhygibbzz7dr5g4hyyxntpuk6ujvvgdqbyacje7qi.ipfs.infura-ipfs.io/'
        );
        console.log('Mining -- ', memeTxn.hash);

        await memeTxn.wait();
        console.log('Minied -- ', memeTxn.hash);

        count = await memePortalContract.getTotalMemes();
        console.log('Retrieved total meme count...', count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='mainContainer'>
      <div className='flex flex-row justify-evenly w-full m-5'>
        <ProfileSection />
        <div>
          {!currentAccount && (
            <button
              className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
              onClick={connectWallet}
            >
              Connet Wallet
            </button>
          )}
        </div>
      </div>
      <div className='dataContainer'>
        <div className='header m-2'>
          <span role='img' aria-label='hand-wave'>
            👋
          </span>
          {''}
          Hey there!
        </div>

        <div className='text-center'>
          I'm Flor a software developer. In my free time I like to learn about
          web3. I'm always up for a good laugh, so send me a meme!
        </div>
        <div className='m-8'>
          <ImageUploading
            {...props}
            value={picture}
            onChange={captureFile}
            withIcon={true}
            withPreview={true}
            singleImage={true}
            imgExtension={['.jpg', '.gif', '.png']}
            maxFileSize={5242880}
            buttonText={'Choose meme'}
            label={'Max size: 5mb, image types: jpg | gif | png'}
            className={'border-blue-700'}
            buttonStyles={{
              backgroundColor: 'transparent',
              color: '#1d4ed8',
              opacity: 1,
              border: '1px solid #1d4ed8',
              fontWeight: 500,
            }}
          />
          <div className='w-full text-center'>
            <button
              className='m-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
              onClick={meme}
            >
              Send a meme!
            </button>
          </div>
        </div>
        <div>
          <ul className='divide-y divide-gray-200'>
            {allMemes.map((meme, index) => (
              <li key={index} className='py-4 flex'>
                <img className='' src={meme.fileUrl} alt='meme' />
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>
                    {meme.address}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {meme.timestamp.toDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
