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
} from 'react-native';

import YouTube from 'react-native-youtube';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Card, CardItem } from 'native-base';

import { Actions } from 'react-native-router-flux';

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
      playerHeight: 0
    }
    console.log(this.state);
  }

  convertToSeconds(stringTime) {
    minutes = parseInt(stringTime.substr(0, stringTime.indexOf('m'))) * 60;
    seconds = parseInt(stringTime.substring(stringTime.lastIndexOf("m")+1,stringTime.lastIndexOf("s")));
    return minutes + seconds;
  }

  onReady() {
    this.setState({isReady: true})
    time = this.convertToSeconds(this.state.question.startingTime);
    this.refs.youtubePlayer.seekTo(time);
  }

  render() {
    return (
      <Container scrollEnabled={false}>
        <Header>
          <Left>
            <Icon name='ios-arrow-back' onPress={() => Actions.pop()}/>
          </Left>
          <Body>
            <Title>{this.state.question.episodeInteger}</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content scrollEnabled={false}>
          <YouTube
          ref="youtubePlayer"
          videoId={this.state.question.url} // The YouTube video ID
          play={false}           // control playback of video with true/false
          hidden={false}        // control visiblity of the entire view
          playsInline={true}    // control whether the video should play inline
          loop={false}          // control whether the video should loop when ended
          rel={false}
          showInfo={false}
          onReady={(e)=>this.onReady()}
          onChangeState={(e)=>{this.setState({status: e.state})}}
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
