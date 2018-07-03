import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import LayOut from './page/layout/index';

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <LayOut/>
      </BrowserRouter>
    );
  }
}

export default App;
