import React from 'react';

// Import necessary React Native Components
import {
  Text,
  View
} from 'react-native';

/*
* To compare two similar Notes, for user to decide if he wants to override mismatching remote notes or not.
* This does nothing else; it exists only for visual aid.
*/
class Comparison extends React.Component {

  render() {

    // If there is a mismatch,
    // we highlight the remote note with red backgroundColor
    return (
      <View>
        <View style={{ backgroundColor: '#' + this.props.color }}><Text>L: {this.props.text}</Text></View>
        <View style={{ backgroundColor: '#' + this.props.colorRemote }}><Text>R: {this.props.textRemote}</Text></View>
        <View style={{ backgroundColor: '#' + this.props.color }}><Text>L: {this.props.title}</Text></View>
        <View style={{ backgroundColor: '#' + this.props.colorRemote }}><Text>R: {this.props.titleRemote}</Text></View>
      </View>);
  }
}

export default Comparison;
