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

// Image baseURL
var imageUrl = 'http://users.jyu.fi/~tekapyla/erikoistyo/images/';
// Import Images
// import synchronizeNotes from '../../assets/images/synchronizeNotes.png';

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
      reveal: false,
      notes: [...this.props.notes]
    }

    this.synchronize = this.synchronize.bind(this);
    this.upload = this.upload.bind(this);
  }

  /*
  * Here we call two functions to synchronize notes between the client and endpoint.
  */
  async synchronize() {

    // Let's not render the notes
    this.props.hideNotes(true);

    // We wait until we have downloaded all the remote notes.
    let clonedNotes = await syncDownload(this.props.api, [...this.props.notes], this.props.orderChanged);

    this.setState({
      notes: clonedNotes
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    // Callback to Notes.js
    this.props.updateNotes(clonedNotes);
  }

  /*
  * We upload local Notes to the endpoint...
  */
  async upload(confirmation) {
    //... the magic happens here
    let notes = await syncUpload(this.props.api, this.props.write, [...this.state.notes], confirmation);

    // After successful sync Operation we also update the state
    this.setState({
      notes: notes
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    // Callback to Notes to update Note-elements for the enduser.
    this.props.updateNotes(notes);

    // Callback to render notes again
    this.props.hideNotes(false);

    // The deed is done.
    if (confirmation === 1) {
      Alert.alert(
        "Synchronization successful (local recent notes prioritized)"
      );
    } else {
      Alert.alert(
        "Synchronization successful (remote recent notes prioritized)"
      );
    }
  }

  /*
  * This is called upon to make sure that updates are not lacking behind
  * "by one step" due to asynchronious nature of ReactJS states.
  */
  updateItem() {
    this.setState(this.state);
  }

  render() {

    let renderNotes = [];
    let warning = false,
        warningCount = 0;

    if (this.props.hideContent) {

      for (let note of this.state.notes) {

        if (note.warning === true) {

          if (note.text.localeCompare(note.textRemote) === 0 && note.title.localeCompare(note.titleRemote) === 0) {
            continue;
          }

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

    if (warningCount > 0) warning = true;

    // User will see the warning message and is also prompted to choose whether he likes to prioritize more recent local or remote edits
    //let message = renderNotes.length ? "WARNING! Some of the remote content might have been edited more recently than your local notes. If you confirm to sync Notes between the browser and the endpoint database, you will lose some remote content (a text with red background). Press 'Prioritize local edits' to proceed to syncronize and to upload all the notes to the database, OR 'Prioritize remote edits' to keep the most recent remote edits (YOU WILL LOSE OLDER LOCAL GREEN ONES). This action is irreversible. Keep on mind that apart from these mismatches everything else will be syncronized in such a way that all the notes can be similarly found both from the client and database. In situations where you only use this app through a browser client, it is typically enough to choose 'Priotize local edits'" : "";
    //<View><Text style={{ paddingHorizontal: '5%' }}>{message}</Text></View>

    // We render this if the content is visible.
    let content = this.props.hideContent ?
    <View>
      <View><TouchableOpacity onPress={() => this.synchronize()}><Image source={{ uri: imageUrl + 'synchronizeNotes.png' }} style={styles.sync}/></TouchableOpacity></View>
      <View style={{ marginTop: 20, paddingHorizontal: '3%', width: 350, zIndex: 9999}}>
       {warning ? <View><Text style={styles.h2}>Remote database contains more recent edits!</Text></View>:<View style={{ marginTop: 20 }}><Text style={{ textAlign: 'center' }}>It seems that there are no mismatches between remote and local. Click button to proceed.</Text></View>}
        <View>{renderNotes}</View>
        {warning ?
        <View style={styles.syncButtons}>
          <View style={{ marginVertical: 10 }}><Button onPress={() => this.upload(1)} title="Prioritize local edits"></Button></View>
          <View><Button onPress={() => this.upload(0)} title="Prioritize remote edits"></Button></View>
        </View>
      :<View style={{ left: 10,marginVertical: 10 }}><Button style={{ }} onPress={() => this.upload(1)} title="Proceed"></Button></View>}
      </View>
    </View> :
    // And this if the content is not visible.
    <View><TouchableOpacity onPress={() => this.synchronize()}><Image source={{ uri: imageUrl + 'synchronizeNotes.png' }} style={styles.sync}/></TouchableOpacity></View>

    return <View>{content}</View>;
  }
}

export default Synchronize;
