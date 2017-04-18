/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  NetInfo,
  Alert
} from 'react-native';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Card, CardItem, Item, Input, Separator, Text, Spinner } from 'native-base';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

import { Actions } from 'react-native-router-flux';

const AGOLIA_API_KEY = 'cdb135f9dbd8a5bb494bd1b14dcb120d'
const AGOLIA_APP_ID = 'XK21FUVR0Q'
const algoliasearch = require('algoliasearch/reactnative')(AGOLIA_APP_ID, AGOLIA_API_KEY);
import AlgoliaSearchHelper from 'algoliasearch-helper';


export default class List extends Component {
  constructor(props) {
    super(props);
    this.helper = AlgoliaSearchHelper(algoliasearch, 'ANSWERS_EPISODE_DESC', {
      hitsPerPage: 30
    });
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      results: null,
      pageCount: 0,
      dataSource: ds,
      searchText: '',
      searchBarOpen: false,
      loading: true,
      connection: false
    }
  }

  componentDidMount() {
    NetInfo.addEventListener(
      'change',
      this.handleConnectionInfoChange
    );
    this.helper.once('result', (res) => {
      console.log(res)
      this.setState({dataSource: this.state.dataSource.cloneWithRows(res.hits)}, () => {
        this.setState({loading: false});
      })
   });
 };

 componentWillUnmount() {
    NetInfo.removeEventListener(
        'change',
        this.handleConnectionInfoChange
    );
  }

  handleConnectionInfoChange = (reach) => {
    console.log(reach);
    if (reach == 'wifi' || reach == 'cell') {
      console.log('Mans got a connnection ')
      this.setState({connection: true}, () => {
        this.helper.search();
      })
    } else {
      console.log('No fucking connection')
      this.setState({connection: false},() => {
        this.setState({loading: false});
      })
    }
  }

 openQuestion(data) {
   Actions.detail({question: data})
 }

 search(text) {
   if (this.refs.listView) {
     this.refs.listView.scrollTo({x: 0, y: 0 ,animated: false});
   }
   this.setState({searchText: text})
   this.helper.once('result', (res) => {
     this.setState({dataSource: this.state.dataSource.cloneWithRows(res.hits)})
   })
   this.helper.setQuery(text).search()
   console.log(this.state.dataSource)
 }

 nextPage() {
   if (this.state.connection) {
     this.setState({pageCount: this.state.pageCount + 1}, () => {
       this.nextPageSearch()
     });
   }
 }

 nextPageSearch() {
   this.helper.once('result', (res) => {
     let newArray = this.state.dataSource._dataBlob.s1;
     for (let question in res.hits) {
       newArray.push(res.hits[question])
     }
     this.setState({dataSource: this.state.dataSource.cloneWithRows(newArray)})
   })
   this.helper.setPage(this.state.pageCount).search();
 }

 cancelSearch() {
   this.search('');
   this.setState({searchBarOpen: false});
 }


  render() {
    return (
      <Container>
          {this.state.searchBarOpen &&
            <Header style={{backgroundColor: '#c21707'}} searchBar rounded>
              <Item style={{ backgroundColor: 'white' }}>
                  <Icon name="search" />
                  <Input placeholder="Search"
                   onChangeText={(text) => this.search(text)}
                   value={this.state.searchText}
                   clearButtonMode='always'
                   returnKeyType='done'
                   clearButtonMode='never'
                   />
                   <Icon onPress={() => this.cancelSearch()} name="md-close" />
              </Item>
            </Header>
          }
          {!this.state.searchBarOpen &&
            <Header style={{backgroundColor: '#c21707'}} >
              <Left>
              </Left>
              <Body style={{ flex: 3 }}>
                <Title style={{fontFamily: 'Knockout50A', fontSize: 24, color: 'white'}}>
                  ASKGARYVEE
                </Title>
              </Body>
              <Right>
                {this.state.connection && !this.state.loading &&
                  <Button onPress={() => this.setState({searchBarOpen: true})} transparent>
                      <Icon style={{ color:'white' }} name="search" />
                  </Button>
                }
              </Right>
            </Header>
          }
          {this.state.loading &&
            <Spinner color='#c21707'/>
          }
          {!this.state.loading && this.state.connection &&
            <ListView
            ref='listView'
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID) =>
               <Card>
                <CardItem bordered>
                  <Text>Episode: #{rowData.episodeInteger}</Text>
                </CardItem>
                 <CardItem onPress={() => this.openQuestion(rowData)}>
                   <Body>
                    <Text style={styles.welome}>{rowData.question}</Text>
                   </Body>
                 </CardItem>
               </Card>}
            onEndReached={() => this.nextPage()}
            renderFooter={() =>
              <Spinner color='#c21707'/>
            }
            />
          }
          {!this.state.loading && !this.state.connection &&
            <Content>
              <Card>
                <CardItem>
                  <Body>
                    <Text>
                      You have no internet connection!
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          }


      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('List', () => List);
