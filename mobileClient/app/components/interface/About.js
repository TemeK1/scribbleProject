import React from 'react';
import cancelNote from '../../assets/images/cancelNote.png';

import {
  Button,
  Image,
  Linking,
  Text,
  Pressable,
  View
} from 'react-native';

import { styles } from '../../assets/style/styles.js';

/*
* Just a simple Component for rendering about
* details of the App for the end user to see.
*/

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creator: '-Teemu "TemeKK1" Käpylä',
      text: "Thank you for using Scribble 2000. It is very simple, but yet, powerful application for scribbling notes that add some spice and color on your life.",
      text2: "If you have ideas, suggestions, feedback or whatsoever, feel free to contact me via email. Copyright for pictures belongs to Arjane. Feel free to check her blog.",
      email: 'contact@teemukapyla.dev',
      website: 'https://www.teemukapyla.fi',
      reveal: false,
      graphics: "https://www.arjane.blog"
    }
  }

  /*
  * SWAP for this.state.reveal which
  * indicates IF the  content IS VISIBLE OR NOT.
  */
  about() {
    if (this.state.reveal === false) {
      this.setState({reveal: true});
    } else {
      this.setState({reveal: false});
    }

  }

  render() {
    // We render this if the content is visible.
    let content = this.state.reveal ?
    <View style={styles.aboutLayer}>
      <Text>{this.state.text}</Text>
      <Text>{this.state.text2}</Text>
      <Text style={styles.address}>{this.state.email}</Text>
      <Pressable onPress={() => Linking.openURL(this.state.website)}>
        <Text style={{color: 'white', backgroundColor: '#4A2C29', marginBottom: '2%'}}>
          {this.state.website}
        </Text>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(this.state.graphics)}>
        <Text style={{color: 'white', backgroundColor: '#4A2C29', marginBottom: '2%'}}>
          {this.state.graphics}
        </Text>
      </Pressable>
      <View style={styles.footer}><Pressable onPress={() => this.about()}><Text>About Scribble 2000</Text></Pressable><Pressable onPress={() => this.about()}><Image source={cancelNote} style={styles.cancel} /></Pressable></View>
    </View>:
    // And this if the content is not visible.
    <View style={styles.footer}><Pressable onPress={() => this.about()}><Text>About Scribble 2000</Text></Pressable></View>;

    return <View>{content}</View>;
  }
}

export default About;
