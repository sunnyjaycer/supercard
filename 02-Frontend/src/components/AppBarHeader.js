import React, { useState, useEffect } from 'react';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
  Grid,
  Card,
  Icon,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import WalletIcon from '../images/walleticon.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
  iconRoot: {
    textAlign: 'center',
  },
}));

const AppBarHeader = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position='static'
        style={{ background: '#FBFBFD', padding: '15px' }}
      >
        <Toolbar>
          <Typography
            variant='h5'
            className={classes.title}
            style={{
              // fontFamily: 'Readex Pro', //This isn't working. Need to import font?
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '50px',
              lineHeight: '110%',
              letterSpacing: '-0.04em',
              color: '#000000',
              textAlign: 'left',
            }}
          >
            SuperCard
          </Typography>

          <ButtonGroup
            variant='text'
            aria-label='text primary button group'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              marginRight: '15px',
            }}
          >
            <Button>Main Screen</Button>
            <Button>Docs</Button>
            <Button>Community</Button>
          </ButtonGroup>

          <Card>
            <Button>
              <Icon>
                <img className={classes.imageIcon} src={WalletIcon} />
              </Icon>
              &nbsp; 0x37363063...18875
              <Icon>
                <KeyboardArrowDownIcon />
              </Icon>
            </Button>
          </Card>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppBarHeader;
