import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  RefreshControl,
  Text,
  TouchableHighlight,
  Image,
  View,
  StyleSheet
} from 'react-native';
import ApiUtils from './ApiUtils'

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export const URL = 'https://gist.githubusercontent.com/slxe6/1d06ccb2c32a2c262c147b7d9ca8250e/raw/d44b52b620c4677459b82597b2f82aade4a0519d/newsfeed.json'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      hasError: false,
      dataSource: ds.cloneWithRows([]),
      items: [],
      error: null,
    }
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.fetchData(URL)
  }

  _onPressButton (rowID) {
    this.state.items.splice(rowID.rowID, 1);
    this.setState({
      dataSource: ds.cloneWithRows(this.state.items)
    });
  }

  componentDidMount() {
    this.fetchData(URL);
  }

  fetchData(url){
    return fetch(url)
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          hasError: false,
          dataSource: ds.cloneWithRows(responseJson),
          items: responseJson,
          error: null,
        }, function() {
          // do something with new state

        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          hasError: true,
          dataSource: ds.cloneWithRows([]),
          items: [],
          error: error,
        })
        //console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating={true} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {this.state.hasError ? (
          <Text style={styles.errorMessage}>
            {this.state.error.message}
          </Text>
        ):null}
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) =>
            <View key={rowID} style={styles.news}>
              <View style={styles.newsBody}>
                <View style={styles.newsHeader}>
                  <TouchableHighlight
                    onPress={() => this._onPressButton({rowID})}
                    >
                    <Image
                      style={styles.closeButton}
                      source={require('./assets/btn_close_32.png')}
                    />
                  </TouchableHighlight>
                </View>
                <View style={styles.imageWrapper}>
                  <Image style={styles.newsImage}
                    source={{uri: rowData.image}}
                  />
                </View>
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>
                    {rowData.title}
                  </Text>
                  {rowData.type == 'event' ? (
                    <Text style={styles.newsDateTime}>
                    {parseDate(rowData.date, rowData.time)}
                    </Text>
                  ): null}
                  <Text style={styles.newsVenue}>
                    {rowData.venue}
                  </Text>
                </View>
              </View>
            </View>
          }
        />
      </View>
    );
  }
}

export function parseDate (date, time){

  if(date.length <= 0 || isNaN(time) || time < 0 || time > 2359){  // if date or time is not valid, return the original data
    return date + " | " + time;
  }else{
    var dateFormat = require('dateformat');
    var d = new Date(date)

    d.setHours(time/100);
    d.setMinutes(time%100);

    return dateFormat(d, "dS mmmm yyyy | htt");
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  errorMessage:{
    textAlign: 'center',
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  news: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  newsBody: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'grey',
  },
  newsHeader:{
    flex: 1,
    alignItems: 'flex-end'
  },
  closeButton: {
    alignItems: 'center',
    padding: 15
  },
  imageWrapper: {
    flex: 1,
  },
  newsImage:{
    flex: 1,
    height: 200,
  },
  newsContent:{
    flex: 1,
    paddingVertical: 15,
  },
  newsTitle:{
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  newsDateTime:{
    flex: 1,
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
  },
  newsVenue:{
    flex: 1,
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
  },
})
