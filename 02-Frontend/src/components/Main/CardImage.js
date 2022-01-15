import React from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SupercardImage from '../../images/Supercard_card.png'; //our supercard 2D image

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
    background: 'none',
    boxShadow: 'none',
  },
}));

const CardImage = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      {' '}
      {/* want to take away border for this card*/}
      <img
        src={SupercardImage}
        style={{
          maxHeight: '25vh',
          // maxHeight: '40vh',
          // display: 'flex',
          width: 'auto',
          margin: 'auto',
          borderRadius: '18px',
        }}
      />
    </Card>
  );
};

export default CardImage;
