import React from 'react';
import Comparison from './Comparison.js';

// Import Functions
import {syncDownload} from '../functions/syncDownload.js';
import {syncUpload} from '../functions/syncUpload.js';

// Import Pictures
import synchronizeNotes from '../../assets/images/synchronizeNotes.png';

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

    this.swap = this.swap.bind(this);
    this.synchronize = this.synchronize.bind(this);
    this.upload = this.upload.bind(this);
  }

  /*
  * Here we call two functions to synchronize notes between the client and endpoint.
  */
  async synchronize() {
    let uploadNotes = true;
    // Swap the visibility of this Component for the enduser.
    this.swap();
    // We wait until we have downloaded all the remote notes.
    let clonedNotes = await syncDownload(this.props.api, [...this.props.notes]);


    for (let note of clonedNotes) {
      // If we find even one note with a mismatch warning, we won't
      // immediately upload our local notes!!
      if (note.warning === true) {
        uploadNotes = false;
        break;
      }
    }

    this.setState({
      notes: clonedNotes
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    // We proceed to upload immediately if there were no warnings.
    if (uploadNotes === true) {
      this.upload(1);
    }

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

    // The deed is done.
    if (confirmation === 1) {
      window.confirm("Synchronization successful (local recent notes prioritized)");
    } else {
      window.confirm("Synchronization successful (remote recent notes prioritized)");
    }

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
  * indicates IF the content IS VISIBLE OR NOT.
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
        // We will warn the user if there is a mismatch.
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

    // User will see the warning message and is also prompted to choose whether he likes to prioritize more recent local or remote edits
    let message = renderNotes.length ? "WARNING! Some of the remote content might have been edited more recently than your local notes. If you confirm to sync Notes between the browser and the endpoint database, you will lose some remote content (a text with red background). Press 'Prioritize local edits' to proceed to syncronize and to upload all the notes to the database, OR 'Prioritize remote edits' to keep the most recent remote edits (YOU WILL LOSE OLDER LOCAL GREEN ONES). This action is irreversible. Keep on mind that apart from these mismatches everything else will be syncronized in such a way that all the notes can be similarly found both from the client and database. In situations where you only use this app through a browser client, it is typically enough to choose 'Priotize local edits'" : "";

    // We render this if the content is visible.
    let content = this.state.reveal && warningCount > 0 ?
    <div>
    <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={() => this.synchronize()}></input></div>
    <div className="aboutLayer">
    <h2>Remote database contains more recent edits!</h2>
    <table>
    <thead>
    <tr><th>Local Text</th><th>Remote Text</th><th>Title, local => remote</th><th>Unique ID</th></tr>
    </thead>
    <tbody>
    {renderNotes}
    </tbody>
    </table>
    <div style={{ marginLeft: "2vw", marginRight: "2vw"}}>{message}</div>
    <div className="syncButtons">
    <button className="tallennus" onClick={() => this.upload(1)}>Prioritize local edits</button>
    <button className="tallennus" onClick={() => this.upload(0)}>Prioritize remote edits</button>
    {this.props.status}
    </div>
    </div>
    </div> :
    // And this if the content is not visible.
    <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={() => this.synchronize()}></input></div>;

    return <div>{content}</div>;
  }
}

export default Synchronize;
