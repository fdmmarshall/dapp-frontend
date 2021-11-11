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
  const contractAddress = '0x5f1Fa7fbe168AFE410f50B40CA1aEecFA7ee68b6';

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

  useEffect(() => {
    let memePortalContract;

    const onNewMeme = (from, timestamp, url) => {
      console.log('NewMeme', from, timestamp, url);
      setAllMemes((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          fileUrl: url,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      memePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      memePortalContract.on('NewMeme', onNewMeme);
    }
    return () => {
      if (memePortalContract) {
        memePortalContract.off('NewMeme', onNewMeme);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        console.log(fileUrl);

        const url = fileUrl.pop();

        console.log(url);

        const memeTxn = await memePortalContract.sendMeme(url, {
          gasLimit: 300000,
        });
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
        <div className='flex flex-col justify-center'>
          <div className='text-center border-b-2 border-solid border-indigo-700 m-8 font-extrabold text-4xl'>
            <h1>Wall of Memes</h1>
          </div>
          <ul className='divide-y divide-gray-200'>
            {allMemes.map((meme, index) => (
              <li key={index} className='py-4 flex justify-between'>
                <div className='flex flex-row'>
                  <div className='ml-3 flex flex-col justify-evenly'>
                    <div className='flex flex-col'>
                      <p>Sent from:{''}</p>
                      <p className='text-sm font-medium text-gray-900'>
                        {meme.address}
                      </p>
                    </div>
                    <div className='flex flex-col'>
                      <p>Sent at:{''}</p>
                      <p className='text-sm text-gray-500'>
                        {meme.timestamp.toDateString()}
                      </p>
                    </div>
                  </div>
                  <img
                    className='h-3/4 w-1/2 m-2'
                    src={meme.fileUrl}
                    alt='meme'
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p>
        Made with
        <span className='p-2' role='img' aria-label='growing-heart'>
          💗
        </span>
        and help from{' '}
        <a
          className='p-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'
          href='https://buildspace.so/'
        >
          buildspace
        </a>
      </p>
    </div>
  );
};

export default App;
