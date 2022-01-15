import React from 'react';
import { Card, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  card: {
    textAlign: 'left',
    padding: '10px 20px 10px 20px',
    margin: '5px 0 5px 0',
    borderRadius: '18px',
    background: '#7D7D7D',
    // display: 'inline-block',
    background: '#D4D4D4',
  },
  cardTextLeft: {
    display: 'inline-block',
  },
  cardTextRight: {
    display: 'inline-block',
    textAlign: 'right',
    float: 'right',
  },
}));

const ActivityCard = () => {
  const classes = useStyles();

  //Going to pass down as props, hardcoded for now
  const recentActivity = [
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
    {
      datetime: 'Jan 14 8:28 AM',
      wallet: 'OxMG...YdtQ',
      token: 'USDC',
      amount: 500,
      action: 'receieve',
    },
  ];
  
  return (
    <Card className={classes.root}>
      <Typography variant='h5' style={{ marginBottom: '20px' }}>
        Activity
      </Typography>
      <Grid container direction='row' spacing={2}>
        <Grid item xs={12}>
          {recentActivity.map((item, index) => (
            <Card className={classes.card}>
              {item.action === 'receieve' && ( //Setting up the logic for when we have inflows and outflows
                <>
                  <Typography variant='body1' className={classes.cardTextLeft}>
                    {`Receieved ${item.amount} ${item.token} from ${item.wallet}`}
                  </Typography>
                  <Typography variant='body2' className={classes.cardTextRight}>
                    {item.datetime}
                  </Typography>
                </>
              )}
            </Card>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};

export default ActivityCard;
