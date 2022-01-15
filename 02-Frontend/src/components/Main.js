import React from 'react';
import { Grid, Card, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import BalanceCard from './Main/BalanceCard';
import CardImage from './Main/CardImage';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: '15px',
  },
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
  iconRoot: {
    textAlign: 'center',
  },
  card: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  },
}));

const Main = () => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div style={{ margin: '100px' }}>
      <Grid //Our master grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={3}
      >
        <Grid container item md={8} xs={12} spacing={2}>
          <Grid item md={6} xs={12}>
            <CardImage />
          </Grid>
          <Grid item md={6} xs={12}>
            <BalanceCard />
          </Grid>

          <Grid item md={6} xs={12}>
            <Card className={classes.card}>
              <Typography variant='h6'>Your Supercards (to do)</Typography>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card className={classes.card}>
              <Typography variant='h6'>
                Monthly Net Flow Card (to do)
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Grid item md={4} xs={12} spacing={2}>
          <Card className={classes.card}>
            <Typography variant='h6'>Transactions (to do)</Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Main;
