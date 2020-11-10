import React from 'react';
import Comparison from './Comparison.js';

// Import Functions
import {syncDownload} from '../functions/syncDownload.js';
import {syncUpload} from '../functions/syncUpload.js';

import {
  Button,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { styles } from '../../assets/style/styles.js';
import { Table, Row, Rows } from 'react-native-table-component';

// Import Images
import synchronizeNotes from '../../assets/images/synchronizeNotes.png';

/*
* To synchronize notes.
*/
class Synchronize extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reveal: false,
      notes: [...this.props.notes]
    }

    this.swap = this.swap.bind(this);
    this.synchronize = this.synchronize.bind(this);
    this.upload = this.upload.bind(this);
  }

  /*
  * Here we call two functions to synchronize notes between the client and endpoint.
  */
  async synchronize() {
    let uploadNotes = true;
    this.swap();
    let clonedNotes = await syncDownload(this.props.api, [...this.props.notes]);

    for (let note of clonedNotes) {
      if (note.warning === true) {
        uploadNotes = false;
        //this.props.notesVisibility(false);
        break;
      }
    }

    this.setState({
      notes: clonedNotes
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    if (uploadNotes === true) {
      this.upload(1);
    }

    // Callback to Notes
    this.props.updateNotes(clonedNotes);
  }

  async upload(confirmation) {
    let notes = await syncUpload(this.props.api, this.props.write, [...this.state.notes], confirmation);

    this.setState({
      notes: notes
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    this.props.updateNotes(notes);
  }

  /*
  * This is called upon to make sure that updates are not lacking behind
  * "by one step" due to asynchronious nature of ReactJS states.
  */
  updateItem() {
    this.setState(this.state);
  }

  /*
  * SWAP for this.state.reveal which
  * indicates IF the  content IS VISIBLE OR NOT.
  */
  swap() {
    if (this.state.reveal === false) {
      this.setState({reveal: true},
        function() {
        this.updateItem(this.state);
        }.bind(this));
    } else {
      this.setState({reveal: false},
        function() {
        this.updateItem(this.state);
        }.bind(this));
    }

  }

  render() {

    let renderNotes = [];
    let warningCount = 0;
    if (this.state.reveal) {

      for (let note of this.state.notes) {

        if (note.warning === true) {
          warningCount++;
          renderNotes.push(<Comparison color={note.color}
            order={note.order} time={note.time} lastEdited={note.lastEdited} title={note.title} text={note.text}
            top={note.top} left={note.left}  colorRemote={note.colorRemote}
            orderRemote={note.orderRemote} timeRemote={note.timeRemote} lastEditedRemote={note.lastEditedRemote}
            titleRemote={note.titleRemote} textRemote={note.textRemote}
            topRemote={note.topRemote} leftRemote={note.leftRemote} warning={note.warning} key={note.time} />);
        }
      }

    }

    let message = renderNotes.length ? "WARNING! Some of the remote content might have been edited more recently than your local notes. If you confirm to sync Notes between the browser and the endpoint database, you will lose some remote content (a text with red background). Press 'Prioritize local edits' to proceed to syncronize and to upload all the notes to the database, OR 'Prioritize remote edits' to keep the most recent remote edits (YOU WILL LOSE OLDER LOCAL GREEN ONES). This action is irreversible. Keep on mind that apart from these mismatches everything else will be syncronized in such a way that all the notes can be similarly found both from the client and database. In situations where you only use this app through a browser client, it is typically enough to choose 'Priotize local edits'" : "";

    // We render this if the content is visible.
    let content = this.state.reveal && warningCount > 0 ?
    <View>
    <View><Pressable onPress={() => this.synchronize()}><Image source={synchronizeNotes} style={styles.sync} /></Pressable></View>
    <View style={styles.aboutLayer}>
    <Text style={styles.h2}>Remote database contains more recent edits!</Text>
    <View style={{ marginLeft: "2vw", marginRight: "2vw" }}><Text>{message}</Text></View>
    <View style={styles.syncButtons}>
    <Pressable style={styles.tallennus} onPress={() => this.upload(1)} value="Prioritize local edits"></Pressable>
    <Pressable style={styles.tallennus} onPress={() => this.upload(0)} value="Prioritize remote edits"></Pressable>
    </View>
    </View>
    </View> :
    // And this if the content is not visible.
    <View><Pressable onPress={() => this.synchronize()}><Image source={synchronizeNotes} style={styles.sync} /></Pressable></View>

    return <View>{content}</View>;
  }
}

export default Synchronize;
