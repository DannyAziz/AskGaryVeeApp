/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';

import YouTube from 'react-native-youtube';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Card, CardItem, Text } from 'native-base';

import { Actions } from 'react-native-router-flux';

const YOUTUBE_API = 'AIzaSyD9LwQllr5AJ4V8hZqq0vjhB9TmSsQbud0'

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      status: null,
      quality: null,
      error: null,
      currentTime: null,
      duration: null,
      question: this.props.question,
      playerHeight: 0,
      play: false
    }
    console.log(this.state);
  }

  convertToSeconds(stringTime) {
    stringTime = stringTime.substring(0,10);
    minutes = parseInt(stringTime.substr(0, stringTime.indexOf('m'))) * 60;
    seconds = parseInt(stringTime.substring(stringTime.lastIndexOf("m")+1,stringTime.lastIndexOf("s")));
    return minutes + seconds;
  }

  onReady() {
    this.setState({isReady: true})
    if (this.state.question.startingTime) {
      time = this.convertToSeconds(this.state.question.startingTime);
      this._youTubePlayer.seekTo(time);
    }
  }

  render() {
    return (
      <Container scrollEnabled={false}>
        <Header style={{backgroundColor: '#c21707'}}>
          <Left>
            <Icon style={{color: 'white'}} name='ios-arrow-back' onPress={() => Actions.pop()}/>
          </Left>
          <Body style={{flex: 3}}>
            <Title style={{color: 'white'}}>{this.state.question.episodeInteger} - {this.state.question.question}</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content scrollEnabled={false}>
          <YouTube
          ref={(component) => {
            this._youTubePlayer = component;
          }}
          apiKey={YOUTUBE_API}
          videoId={this.state.question.url} // The YouTube video ID
          play={true}           // control playback of video with true/false
          hidden={false}        // control visiblity of the entire view
          fullscreen={false}    // control whether the video should play inline
          loop={false}          // control whether the video should loop when ended
          controls={2}
          rel={false}
          showInfo={false}
          onReady={(e)=>{
              console.log(e)
              this.onReady()
          }}
          onChangeState={(e)=>{
            console.log(e)
            this.setState({status: e.state})
          }}
          onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
          onError={(e)=>{this.setState({error: e.error})}}
          onProgress={(e)=>{this.setState({currentTime: e.currentTime, duration: e.duration})}}

          style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black'}}
          />

          <Card>
              <CardItem>
                  <Body>
                      <Text>{this.state.question.question}</Text>
                  </Body>
              </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}


AppRegistry.registerComponent('Detail', () => Detail);
