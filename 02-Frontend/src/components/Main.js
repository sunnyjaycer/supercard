import React from 'react';
import { Grid, Card, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import BalanceCard from './Main/BalanceCard';
import CardImage from './Main/CardImage';
import YourSupercards from './Main/YourSupercards';
import NetFlowCard from './Main/NetFlowCard';
import ActivityCard from './Main/ActivityCard';

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
  mainDiv: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '80px',
    marginBottom: '100px',
  },
}));

const Main = () => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.mainDiv}>
      <Grid //Our master grid
        container
        direction='row'
        spacing={3}
      >
        <Grid container item md={8} xs={12} spacing={2} alignItems='stretch'>
          <Grid item md={6} xs={12} style={{ display: 'flex' }}>
            <CardImage />
          </Grid>
          <Grid item md={6} xs={12} style={{ display: 'flex' }}>
            <BalanceCard />
          </Grid>

          <Grid item md={6} xs={12} style={{ display: 'flex' }}>
            <YourSupercards />
          </Grid>
          <Grid item md={6} xs={12} style={{ display: 'flex' }}>
            <NetFlowCard />
          </Grid>
        </Grid>
        <Grid
          container
          item
          md={4}
          xs={12}
          spacing={2}
          style={{ display: 'flex' }}
        >
          <ActivityCard />
        </Grid>
      </Grid>
    </div>
  );
};

export default Main;
