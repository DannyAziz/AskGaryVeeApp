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
  ListView
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
      loading: true
    }
  }

  componentDidMount() {
    this.helper.once('result', (res) => {
      console.log(res)
      this.setState({dataSource: this.state.dataSource.cloneWithRows(res.hits)}, () => {
        this.setState({loading: false});
      })
   });
   this.helper.search();
 };

 openQuestion(data) {
   Actions.detail({question: data})
 }

 search(text) {
   this.refs.listView.scrollTo({x: 0, y: 0 ,animated: false});
   this.setState({searchText: text})
   this.helper.once('result', (res) => {
     this.setState({dataSource: this.state.dataSource.cloneWithRows(res.hits)})
   })
   this.helper.setQuery(text).search()
   console.log(this.state.dataSource)
 }

 nextPage() {
   this.setState({pageCount: this.state.pageCount + 1}, () => {
     this.nextPageSearch()
   });

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
              <Item>
                  <Icon name="search" />
                  <Input placeholder="Search"
                   onChangeText={(text) => this.search(text)}
                   value={this.state.searchText}
                   clearButtonMode='always'
                   returnKeyType='done'
                   />
                   <Icon onPress={() => this.cancelSearch()} name="md-close" />
              </Item>
            </Header>
          }
          {!this.state.searchBarOpen &&
            <Header style={{backgroundColor: '#c21707'}} >
              <Left>
              </Left>
              <Body>
                <Title style={{fontFamily: 'Knockout50A', fontSize: 24, color: 'white'}}>
                  ASKGARYVEE
                </Title>
              </Body>
              <Right>
                <Button onPress={() => this.setState({searchBarOpen: true})} transparent>
                    <Text style={{color: 'white'}}>Search</Text>
                </Button>
              </Right>
            </Header>
          }
          {this.state.loading &&
            <Spinner color='#c21707'/>
          }
          {!this.state.loading &&
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
            />
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
