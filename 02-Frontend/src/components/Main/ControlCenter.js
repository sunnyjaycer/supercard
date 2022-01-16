import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BigNumber } from 'ethers';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    // justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
  },

  card: {
    textAlign: 'left',
    borderRadius: '18px',
    padding: '15px',
    background: '#7D7D7D',
    color: '#FFFFFF',
  },
  locButton: {
    textAlign: 'center',
    display: 'flex',
    margin: 'auto',
  },
}));

const ControlCenter = ({ account, contract }) => {
  const [locOpen, setLocOpen] = useState(false); //whether or not a LOC is open yet -- we will get this from the contract
  const [locAmount, setLocAmount] = useState(null); //value of LOC
  const [availableCredit, setAvailableCredit] = useState(null); //available credit

  const [borrowAmount, setBorrowAmount] = useState(null); //borrow amount specified by user
  const [repayAmount, setRepayAmount] = useState(null); //repay amount specified by the user

  const classes = useStyles();

  //   //Making sure account and contract are coming in
  //   useEffect(() => {
  //     console.log('Account is');
  //     console.log(account);
  //     console.log('Contract is');
  //     console.log(contract);
  //   }, [account, contract]);

  //Getting whether or not a user has a Loc open
  useEffect(() => {
    const checkUserLocStatus = async () => {
      const txn = await contract.getLocStatusFromEmployee(account);
      console.log(txn);
      setLocOpen(txn);
    };
    if (account && contract) {
      checkUserLocStatus();
    }
  }, [account, contract]);

  //Getting the amount of credit a user has (if they have an LOC open)
  useEffect(() => {
    const getUserLocAmountAndBorrowed = async () => {
      console.log("HENRYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
      let txn = await contract.getAvailableCreditFromEmployee(account);
      // await txn.wait();
      console.log(txn);
      setAvailableCredit(txn.toString());
      txn = await contract.getLocAmount();
      // await txn.wait();
      console.log(txn);
      setLocAmount(txn.toString());
      console.log('Available credit is ' + availableCredit);
      console.log('LOC Amount is ' + locAmount);
    };
    if (account && contract) {
      getUserLocAmountAndBorrowed();
    }
  }, [locOpen, account, contract]);

  

  //Opening a line of credit by calling openLOC from contract
  const openLOC = async () => {
    const txn = await contract.openLoc();
    await txn.wait();
    console.log(txn);
    console.log(`See transaction: https://goerli.etherscan.io/tx/${txn.hash}`);
  };

  const closeLOC = async () => {
    //Calling the close LOC function
    const txn = await contract.closeLoc();
    await txn.wait();
    console.log(txn);
    window.location.reload(false); //Reloading the window
  };

  //Listening for new Loc opened event so don't need to refresh screen
  useEffect(() => {
    if (account && contract) {
      const onNewLocOpened = (employee) => {
        setLocOpen(true);
      };

      if (window.ethereum) {
        contract.on('LOCOpened', onNewLocOpened);
      }

      return () => {
        if (contract) {
          contract.off('LOCOpened', onNewLocOpened);
        }
      };
    }
  }, [account, contract]);

  //When a user borrows money
  const borrow = async () => {
    console.log('Borrow amount is ' + borrowAmount);
    const txn = await contract.borrow( borrowAmount.toLocaleString('fullwide', {useGrouping:false}) );
    await txn.wait();
    console.log(txn);
  };

  const repay = async () => {
    console.log('Repay amount is ' + repayAmount);
    const txn = await contract.repay( repayAmount.toLocaleString('fullwide', {useGrouping:false}) );
    await txn.wait();
    console.log(txn);
  };

  return (
    <Card className={classes.root}>

      {locAmount && availableCredit && (
        <>
          <Typography variant='body1' style={{ paddingTop: '5vh' }}>
            Borrowed: <strong>{(locAmount - availableCredit)/(10**18)} USDC</strong>
          </Typography>
          <Typography variant='body1'>
            Available Credit: <strong>{(availableCredit)/(10**18)} USDC</strong>
          </Typography>
        </>
      )}
      {locOpen && (
        <Card className={classes.locButton}>
          <Button onClick={closeLOC}>
            <Typography variant='body1'>Close Credit Line</Typography>
          </Button>
        </Card>
      )}
      {!locOpen && (
        <Card className={classes.locButton}>
          <Button onClick={openLOC}>
            <Typography variant='body1'>Open Credit Line</Typography>
          </Button>
        </Card>
      )}
      {locOpen && (
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          spacing={4}
          style={{ paddingBottom: '5vh' }}
        >
          <Grid item md={6} xs={12}>
            <TextField
              label='Borrow Amount'
              helperText='Borrow'
              onChange={(e) => {
                setBorrowAmount(e.target.value*(10**18));
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Card style={{ marginTop: '15px' }}>
              {' '}
              <Button onClick={borrow}>Borrow</Button>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            {' '}
            <TextField
              label='Repay Amount'
              helperText='Repay'
              onChange={(e) => {
                setRepayAmount(e.target.value*(10**18));
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Card style={{ marginTop: '15px' }}>
              {' '}
              <Button onClick={repay}>Repay</Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

export default ControlCenter;
