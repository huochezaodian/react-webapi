import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { createBrowserHistory } from 'history';
// import { Router } from 'react-router';
import './App.css';
import LayOut from './page/layout/index';
import { connect } from 'react-redux';
import { changeMenu } from './store/menu/menu.action';

// const history = createBrowserHistory();

class App extends Component {
  componentWillMount () {
    this.props.updateMenu();
  }
  render () {
    return (
      <LayOut/>
    );
  }
}

App.propTypes = {
  updateMenu: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  navs: state.menu.navs
});

const mapDispatchToProps = dispatch => ({
  updateMenu: () => dispatch(changeMenu())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
