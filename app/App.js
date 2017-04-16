/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Scene, Router} from 'react-native-router-flux';

import List from './components/list';
import Detail from './components/detail';

export default class askGaryVee extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar>
          <Scene key="list" component={List} title='List' initial={true} />
          <Scene key="detail" component={Detail} title='Detail' />
        </Scene>
      </Router>
    );
  }
}


AppRegistry.registerComponent('askGaryVee', () => askGaryVee);
