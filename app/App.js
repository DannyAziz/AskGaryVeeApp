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

import {Scene, Router, ActionConst} from 'react-native-router-flux';

import splashScreen from './components/splashScreen';
import List from './components/list';
import Detail from './components/detail';

export default class askGaryVee extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar>
          <Scene key="splashScreen" component={splashScreen} title="SplashScreen" initial={true} />
          <Scene key="list" component={List} title='List'/>
          <Scene key="detail" component={Detail} title='Detail' />
        </Scene>
      </Router>
    );
  }
}


AppRegistry.registerComponent('askGaryVee', () => askGaryVee);
