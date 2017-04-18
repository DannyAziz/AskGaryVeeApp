import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Animated,
  Text,
  Dimensions
} from 'react-native';


import Animation from 'lottie-react-native';

import { Actions, ActionConst } from 'react-native-router-flux';


export default class splashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
    console.log(this)
    Animated.timing(this.state.progress, {
      toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Actions.list({type: ActionConst.REPLACE})
        }, 500)
      });
    }


    render() {
      return(
        <Animation
        ref='lottie'
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: '#CADAE9'
        }}
        source={require('../../assets/animations/data.json')}
        progress={this.state.progress}
      />
    )
  }
}

AppRegistry.registerComponent('splashScreen', () => splashScreen);
