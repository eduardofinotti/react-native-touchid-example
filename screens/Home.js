import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Home extends Component {
  constructor() {
    super()

    this.state = {
    };
  }


  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.label}>Home!</Text>
      </View>
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
  label: {
    color: 'black',
    fontWeight: '600',
    margin: 20
  }


});