import React from 'react';
import { Card, Typography } from '@material-ui/core';
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
}));

const NetFlowCard = () => {
  const classes = useStyles();

  //Will pass this down as props later
  const monthlyInflow = '5000';
  const monthlyOutflow = '1000';
  const perMinuteInflow = '0.48';
  const perMinuteOutflow = '0.18';

  return (
    <Card className={classes.root}>
      <Typography variant='h5' style={{ marginBottom: '20px' }}>
        Monthly Net Flows
      </Typography>
      <Typography variant='subtitle1'>{`+$${monthlyInflow} (+$${perMinuteInflow} per minute)`}</Typography>
      <Typography variant='subtitle1'>{`-$${monthlyOutflow} (-$${perMinuteOutflow} per minute)`}</Typography>
    </Card>
  );
};

export default NetFlowCard;
