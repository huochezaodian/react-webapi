import React, { Component } from 'react';
import {
  HashRouter,
  Route,
  Link
} from 'react-router-dom';
import logo from './logo.svg';
import styles from './App.css';
import Nav1 from './page/nav1';
import Nav2 from './page/nav2';

class App extends Component {
  render () {
    return (
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <img src={logo} className={styles['App-logo']} alt="logo" />
          <h1 className={styles['App-title']}>Welcome to React</h1>
        </header>
        <p className={styles['App-intro']}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <HashRouter>
          <div>
            <a href="/#/nav1">nav1</a>
            <a href="/#/nav2">nav2</a>
            <br/>
            <Link to="nav1"> nav1</Link>
            <Link to="nav2"> nav2</Link>
            <br/>
            <Route path="/nav1" component={Nav1}/>
            <Route path="/nav2" component={Nav2}/>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
