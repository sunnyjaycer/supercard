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
  cardTextLeft: {
    display: 'block',
  },
  cardTextRight: {
    display: 'block',
    textAlign: 'right',
    float: 'none',
  },
}));

const BalanceCard = () => {
  const classes = useStyles();

  //Will pass this down as props later
  const monthlyInflow = '5000';
  const monthlyOutflow = '1000';

  return (
    <Card className={classes.root}>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <Typography variant='h5' className={classes.cardTextLeft}>
            Balance
          </Typography>
          <br />
          <Typography variant='h3' className={classes.cardTextLeft}>
            <strong>$5000 USDC</strong>
          </Typography>
          <br />
          <Typography variant='body2' className={classes.cardTextLeft}>
            This is the net amount streaming into your account
          </Typography>
          <br />
          <Typography
            variant='subtitle1'
            className={classes.cardTextRight}
            style={{ color: 'green' }}
          >{`+$${monthlyInflow} per month`}</Typography>
          <Typography
            variant='subtitle1'
            className={classes.cardTextRight}
            style={{ color: 'red' }}
          >{`-$${monthlyOutflow} per month`}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BalanceCard;
