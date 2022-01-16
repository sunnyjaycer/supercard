import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Button, Typography } from '@material-ui/core';
import { ethers } from 'ethers';
import Main from './components/Main';
import AppBarHeader from './components/AppBarHeader';
// import SuperfluidSDK from '@superfluid-finance/js-sdk';
// import Web3Provider from '@ethersproject/providers';
// import Web3 from 'web3';

const useStyles = makeStyles((theme) => ({}));

function App() {
  //Setting initial state vars
  const [currentAccount, setCurrentAccount] = useState(null); //User's wallet address
  const [network, setNetwork] = useState(''); //Rinkeby for now
  const [flowData, setFlowData] = useState({});

  //Checking to make sure wallet is connected
  const checkWalletConnection = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('Connected to chain ' + chainId);

    //Making sure only Rinkeby test net accounts are connected
    const goerliChainId = '0x5';
    if (chainId !== goerliChainId) {
      alert('Please connect to the Goerli Test Network!');
    }

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
      setCurrentAccount(null);
    }
  };

  //Connecting wallet
  const connectWalletAction = async () => {
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

  //Making sure we're conncted to Goerli testnet
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '5') {
        alert('Please connect to Goerli!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Check wallet when page loads
  useEffect(() => {
    checkNetwork();
    checkWalletConnection();
  }, []);

  useEffect(() => {
    const queryFlowData = async () => {
      const queryAddress =
        'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-goerli';
      const flowAccount = '0x60ef4c93ce8c6e0182bc1c83a7ce47053c5af6c6';

      const query = `{
        account(id: "${flowAccount.toLowerCase()}") {
            flowsOwned {
                lastUpdate
                flowRate
                sum
                recipient {
                  id
                }
                token { 
                    id
                    symbol
                }
                events {
                  flowRate
                  sum
                  transaction {
                    timestamp
                  }
                }
            }
            flowsReceived {
              lastUpdate
              flowRate
              sum
              owner {
                id
              }
              token { 
                  id
                  symbol
              }
              events {
                flowRate
                sum
                transaction {
                  timestamp
                }
              }
            }
        }
      }`;

      const res = await axios.post(queryAddress, { query });
      setFlowData(res.data.data.account);
      // console.log('Our flow data is: ');
      // console.log(res.data.data.account);
      // console.log(res);
    };
    if (currentAccount) {
      queryFlowData();
    }
  }, [currentAccount]);

  if (!currentAccount) {
    return (
      //connect wallet screen
      <body
        style={{
          backgroundImage: 'linear-gradient(to right, #B2FFA3,#FFAAAA,#C2AAFF)',
          height: '100vh',
          minHeight: '100vh',
          padding: '35vw',
        }}
      >
        <div>
          <Card
            style={{
              textAlign: 'center',
              padding: '10px',
              borderRadius: '18px',
            }}
          >
            <Button onClick={connectWalletAction}>
              <Typography variant='h5'>Connect Wallet</Typography>
            </Button>
          </Card>
        </div>
      </body>
    );
  } else {
    return (
      <div className='App'>
        <AppBarHeader account={currentAccount} />
        <Main />
      </div>
    );
  }
}

export default App;
