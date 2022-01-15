import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AppBarHeader from './components/AppBarHeader';
import Docs from './components/Docs';
import Community from './components/Community';
import reportWebVitals from './reportWebVitals';
import { createMuiTheme } from '@material-ui/core/styles';

//Custom theme can go here if we want one
// const theme = createMuiTheme({
//   palette: {
//     type: 'light',
//   },
// });

const rootElement = document.getElementById('root');
ReactDOM.render(
  <BrowserRouter>
    <AppBarHeader />
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='docs' element={<Docs />} />
      <Route path='community' element={<Community />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
