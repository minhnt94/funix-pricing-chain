import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import AppContextProvider from './AppContext';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  document.getElementById('root')
);
