import React, { useState } from 'react';
import { Card, Typography, Button, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const ControlCenter = () => {
  const [locOpen, setLocOpen] = useState(true); //whether or not a LOC is open
  const [borrowAmount, setBorrowAmount] = useState(null); //borrow amount specific by user
  const [repayAmount, setRepayAmount] = useState(null); //repay amount specific by user

  const locAmount = 2000; //value of LOC
  const classes = useStyles();

  //Just demonstrating how card will change when state is changed
  const locButtonClicked = () => {
    setLocOpen(!locOpen);
    console.log(locOpen);
  };

  return (
    <Card className={classes.root}>
      {locOpen && (
        <>
          <Typography variant='body1' style={{ paddingTop: '5vh' }}>
            Borrowed: <strong>{locAmount}</strong>
          </Typography>
          <Typography variant='body1'>
            Available Credit: <strong>0</strong>
          </Typography>
        </>
      )}
      {!locOpen && (
        <>
          <Typography variant='body1' style={{ paddingTop: '5vh' }}>
            Borrowed: <strong>0</strong>
          </Typography>
          <Typography variant='body1'>
            Available Credit: <strong>{2000}</strong>
          </Typography>
        </>
      )}
      {locOpen && (
        <Card className={classes.locButton}>
          <Button onClick={locButtonClicked}>
            <Typography variant='body1'>Close Credit Line</Typography>
          </Button>
        </Card>
      )}
      {!locOpen && (
        <Card className={classes.locButton}>
          <Button onClick={locButtonClicked}>
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
            {' '}
            <TextField
              label='Borrow Amount'
              helperText='Borrow'
              onChange={(e) => {
                setBorrowAmount(e.target.value);
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            {' '}
            <TextField
              label='Repay Amount'
              helperText='Repay'
              onChange={(e) => {
                setRepayAmount(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

export default ControlCenter;
