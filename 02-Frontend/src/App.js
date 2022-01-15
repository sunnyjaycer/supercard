import React, { useState, useEffect } from 'react';
import './App.css';
// import Web3 from 'web3';
import axios from 'axios';
// import SuperfluidSDK from '@superfluid-finance/js-sdk';
// import Web3Provider from '@ethersproject/providers';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import AppBarHeader from './components/AppBarHeader';
import Main from './components/Main';

const useStyles = makeStyles((theme) => ({}));

function App() {
  //Setting initial state vars
  const [account, setAccount] = useState(''); //User's wallet address
  const [network, setNetwork] = useState(''); //Rinkeby for now
  const [sf, setSf] = useState(null); //Superfluid SDK object
  const [sfUser, setSfUser] = useState(null); //Specific SF user
  const [notConnected, setNotConnected] = useState(false); //If user has connected wallet yet
  const [flowQuery, setFlowQuery] = useState({}); //Querying the income stream
  const superAppAddress = '0x45DC036073F12433BfC13380DD70a8a6c4B2d32f';

  //Loading initial data
  useEffect(() => {
    //Logic here for eth account and loading superfluid data -- joel u can help me lol
    const loadData = async () => {
      setAccount('0xcF4B5f6CCD39a2b5555dDd9e23F3d0b11843086e');
    };
    loadData();
  }, []);

  //Making sure we're conncted to Rinkeby testnet
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        alert('Please connect to Rinkeby!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const queryFlowData = async () => {
    const queryAddress =
      'https://thegraph.com/hosted-service/subgraph/superfluid-finance/protocol-v1-rinkeby';

    const query = `{
      account(id: "${account.toLowerCase()}") {
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

    const res = await axios.get(queryAddress, { query });
    setFlowQuery(res.data);
  };

  return (
    <div className='App'>
      <AppBarHeader />
      <Main />
    </div>
  );
}

export default App;
