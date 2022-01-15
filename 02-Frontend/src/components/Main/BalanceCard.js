import React from 'react';
import { Card, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
  },
}));

const BalanceCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <Typography variant='h5'>Balance</Typography>
          <Typography variant='h3'>
            <strong>$5000</strong>
          </Typography>
          <Typography variant='body1'>+0.48 per minute</Typography>
          <br />
          <Typography variant='body2'>
            This is the net amount streaming into your account
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BalanceCard;
