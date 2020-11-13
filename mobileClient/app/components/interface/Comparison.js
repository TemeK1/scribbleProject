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
    let textRemote = [] ;

    // If there is a mismatch,
    // we highlight the remote note with red backgroundColor
    if (this.props.warning) {
      textRemote.push(<View style={{ backgroundColor: "green" }}><Text>L: {this.props.text}</Text></View>);
      textRemote.push(<View style={{ backgroundColor: "red" }}><Text>R: {this.props.textRemote}</Text></View>);
      textRemote.push(<View><Text style={{ backgroundColor: "green"}}>L: {this.props.title}</Text><Text style={{ backgroundColor: "red" }}>R: {this.props.titleRemote}</Text></View>);
    }

    return (
      <View>
        {textRemote}
      </View>);
  }
}

export default Comparison;
