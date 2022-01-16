import React from 'react';
import { Card, Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    // justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
  },
  card: {
    textAlign: 'left',
    padding: '20px',
    borderRadius: '18px',
    background: '#7D7D7D',
    color: '#FFFFFF',
  },
  mainCard: {
    textAlign: 'left',
    padding: '20px',
    borderRadius: '18px',
    backgroundImage: 'linear-gradient(to right, #B2FFA3,#FFAAAA,#C2AAFF)',
    color: '#FFFFFF',
  },
  cardTextLeft: {
    display: 'inline-block',
  },
  cardTextRight: {
    display: 'inline-block',
    textAlign: 'right',
    float: 'right',
  },
  mintButton: {
    textAlign: 'center',
    display: 'flex',
    margin: 'auto',
  },
}));

const YourSupercards = () => {
  const classes = useStyles();

  //This will be passed down as props
  const supercardStreams = [
    {
      balance: '5000',
      decrease: '1000',
      employer: 'Employer #1',
      wallet: '0x09...fdb7',
    },
    {
      balance: '1000',
      decrease: '100',
      employer: 'Employer #2',
      wallet: '0x09...s314',
    },
    {
      balance: '900',
      decrease: '50',
      employer: 'Employer #3',
      wallet: '0x09...5lk4',
    },
  ];

  return (
    <Card className={classes.root}>
      <Typography variant='h5' style={{ marginBottom: '20px' }}>
        Your Supercards
      </Typography>
      <Grid container direction='row' spacing={2}>
        {supercardStreams.map((item, index) => (
          <Grid item xs={12}>
            {index === 0 && (
              <Card className={classes.mainCard}>
                <Typography variant='body1' className={classes.cardTextLeft}>
                  <strong>${item.balance}</strong>
                </Typography>
                <Typography variant='body2' className={classes.cardTextRight}>
                  {item.wallet}
                </Typography>
                <br />
                <Typography variant='body2' className={classes.cardTextLeft}>
                  -${item.decrease}
                </Typography>
                <Typography variant='body1' className={classes.cardTextRight}>
                  {item.employer}
                </Typography>
              </Card>
            )}
            {/* {index > 0 && (
              <Card className={classes.card}>
                <Typography variant='body1' className={classes.cardTextLeft}>
                  <strong>${item.balance}</strong>
                </Typography>
                <Typography variant='body2' className={classes.cardTextRight}>
                  {item.wallet}
                </Typography>
                <br />
                <Typography variant='body2' className={classes.cardTextLeft}>
                  -${item.decrease}
                </Typography>
                <Typography variant='body1' className={classes.cardTextRight}>
                  {item.employer}
                </Typography>
              </Card>
            )} */}
          </Grid>
        ))}
        <Card className={classes.mintButton}>
          <Button>Mint new Supercard</Button>
        </Card>
      </Grid>
    </Card>
  );
};

export default YourSupercards;
