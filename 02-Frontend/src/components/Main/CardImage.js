import React from 'react';
import { Card, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const CardImage = () => {
  return (
    <Card style={{ border: 'none' }}>
      {' '}
      {/* want to take away border for this card*/}
      <img
        src='https://ipfs.io/ipfs/QmaQCJ5YoP1g48FtrwpUjFfL3nmVVeWVxrNMWkAsRpvjFt'
        style={{ transform: 'rotate(270deg)', borderRadius: '15px' }}
      />
    </Card>
  );
};

export default CardImage;
