import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ImageUploading from 'react-images-upload';
import ProfileSection from './components/ProfileSection';
import abi from './utils/MemePortal.json';
import './App.css';

const App = (props) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [image, setImage] = useState('');

  const onDrop = (image) => {
    setImage([...image, image[0]]);

    console.log(image);
  };

  const contractAddress = '0xA72Fd9fF5CFC715C17E9fD04e39E4A97557871d0';

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
        const account = account[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
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

        const memeTxn = await memePortalContract.sendMeme();
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
            value={image[0]}
            onChange={onDrop}
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
      </div>
    </div>
  );
};

export default App;
