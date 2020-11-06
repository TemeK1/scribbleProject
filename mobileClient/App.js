import React from 'react';
import {styles} from './app/assets/style/styles.js';
import Notes from './app/components/interface/Notes.js';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';

/*
* TIES504 Erikoistyö.
* Notes React Native App "Scribble 2000". App.js renders two main components: Notes & About.
*/

class App extends React.Component {

  render() {
    return (
      <View>
        <SafeAreaView style={styles.fullscreen}>
          <ScrollView style={styles.scroll}>
            <Notes />
           </ScrollView>
        </SafeAreaView>
      </View>
   )
  }
}

export default App;
