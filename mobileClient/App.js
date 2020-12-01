import React from 'react';
import About from './app/components/interface/About.js';
import {styles} from './app/assets/style/styles.js';
import Notes from './app/components/interface/Notes.js';
import { SafeAreaView, ScrollView } from 'react-native';

/*
* TIES504 Erikoistyö.
* Notes React Native App "Scribble 2000". App.js renders two main components: Notes & About.
*/

class App extends React.Component {

  render() {
    return (
      <>
        <SafeAreaView style={styles.fullscreen}>
          <ScrollView style={styles.scroll}>
            <Notes />
            <About />
          </ScrollView>
        </SafeAreaView>
      </>
   )
  }
}

export default App;
