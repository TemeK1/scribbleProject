import React from 'react';
import Comparison from './Comparison.js';

// Import Functions
import {syncDownload} from '../functions/syncDownload.js';
import {syncUpload} from '../functions/syncUpload.js';

// Import necessary React Native Components
import {
  Alert,
  Button,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Import CSS
import { styles } from '../../assets/style/styles.js';

// Import Images
var synchronizeNotes = require('../../assets/images/synchronizeNotes.png');

/*
* To synchronize notes.
* Here we look for mismatches between local (client) and remote (endpoint) edits.
* And synchronize local and remote Notes.
* In case of a mismatch user is prompted to choose whether he would like to prioritize
* more recent local or remote edits.
*/
class Synchronize extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warning: false,
      status: '',
      notes: [],
    }

    this.synchronize = this.synchronize.bind(this);
    this.upload = this.upload.bind(this);
  }

  /*
  * Here we call two functions to synchronize notes between the client and endpoint.
  */
  async synchronize() {
    // We don't want to synchronize twice simultaneously
    if (this.state.status.localeCompare('Sync...') === 0) {
      return;
    }

    let warning = false,
        warningNotes = [];

    this.setState({
      status: 'Sync...',
    }, function() {
         this.updateItem(this.state);
    }.bind(this));

    // We wait until we have downloaded all the remote notes.
    let clonedNotes = await syncDownload(this.props.api, [...this.props.notes], this.props.orderChanged);
    let differenceExceedsThreshold = false;

    for (let note of clonedNotes) {

      // We will warn the user if there is a mismatch.
      if (note.warning === true) {
        // but only if there is actually differences in color, text, or title, and not just in timestamp
        if (note.color.localeCompare(note.colorRemote) === 0 && note.text.localeCompare(note.textRemote) === 0 && note.title.localeCompare(note.titleRemote) === 0) {
          continue;
        }

        if (note.difference >= 60000) {
          differenceExceedsThreshold = true;
        }

        warningNotes.push(note);

      }
    }

    // Callback to Notes to update Note-elements for the enduser.
    await this.props.updateNotes(clonedNotes, true);

    if (!differenceExceedsThreshold) {
      // If mismatch is not longer than 60s, we upload automatically preferring remote recent edits.
      this.upload(false);
    } else if (Array.isArray(warningNotes) && warningNotes.length > 0) {
      // If mismatch is longer than 60s and there is warnings, we let the user choose what to do.
      // Let's not render the notes for time being
      this.props.hideNotes(true);
      warning = true;
    } else {
      // we prefer local more recent updates, because threshold of 60s was not met and/or there were no warnings.
      this.upload(true);
    }

    await this.setState({
      warning: warning,
      warningNotes: warningNotes,
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

  }

  /*
  * We upload local Notes to the endpoint...
  */
  async upload(confirmation) {

    //... the magic happens here
    let notes = await syncUpload(this.props.api, this.props.write, [...this.props.notes], confirmation);

    // After successful sync Operation we also update the state
    this.setState({
      status: '',
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    // Callback to Notes to update Note-elements for the enduser.
    await this.props.updateNotes(notes, false);

    // Callback to render notes again
    await this.props.hideNotes(false);
  }

  /*
  * This is called upon to make sure that updates are not lacking behind
  * "by one step" due to asynchronious nature of ReactJS states.
  */
  updateItem() {
    this.setState(this.state);
  }

  // We immediately synchronize after mounting the component
  componentDidMount() {
    this.synchronize();

    // we relay information of synchronize-function to Notes Component
    this.props.provideSync(this.synchronize);
    // Notes will be synchronized every 60000 (= 1 minute) milliseconds.
    this.sync = setInterval(() => { this.synchronize() }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.sync);
  }

  render() {

    let renderNotes = [];

    if (this.props.hideContent === true && Array.isArray(this.state.warningNotes)) {

      for (let note of this.state.warningNotes) {

          renderNotes.push(<Comparison color={note.color}
            order={note.order} time={note.time} lastEdited={note.lastEdited} title={note.title} text={note.text}
            top={note.top} left={note.left}  colorRemote={note.colorRemote}
            orderRemote={note.orderRemote} timeRemote={note.timeRemote} lastEditedRemote={note.lastEditedRemote}
            titleRemote={note.titleRemote} textRemote={note.textRemote}
            topRemote={note.topRemote} leftRemote={note.leftRemote} warning={note.warning} key={note.time} />);
      }
    }

    // We render this if the content should be visible (we are synchronizing).
    let content = this.props.hideContent ?
    <View>
      <View><TouchableOpacity onPress={() => this.synchronize()}><Image source={synchronizeNotes} style={styles.sync}/></TouchableOpacity></View>
      <View style={{ marginTop: 20, paddingHorizontal: '3%', width: 350, zIndex: 9999}}>
       {this.state.warning ? <View><Text style={styles.h2}>Remote database contains more recent edits!</Text></View>:null}
        <View>{renderNotes}</View>
        <View style={styles.syncButtons}>
          <View style={{ marginVertical: 10 }}><Button onPress={() => this.upload(true)} title="Prioritize local edits"></Button></View>
          <View><Button onPress={() => this.upload(false)} title="Prioritize remote edits"></Button></View>
        </View>
      </View>
    </View> :
    // And this if the content is not visible.
    <View><Text style={{ marginLeft: 5, marginTop: 15, fontSize: 20, position: 'absolute', color: 'green', fontWeight: '800', backgroundColor: 'transparent'}}>{this.state.status}</Text>{this.state.status.length > 1 ? null:<TouchableOpacity onPress={() => this.synchronize()}><Image source={synchronizeNotes} style={styles.sync}/></TouchableOpacity>}</View>

    return <View>{content}</View>;
  }
}

export default Synchronize;
