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
      notes: [...this.props.notes],
      proceedText: 'Proceed',
      local: "Prioritize local edits",
      remote: "Prioritize remote edits"
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

    // We advice user to wait.
    this.setState({
      proceedText: "Wait...",
      local: "Wait...",
      remote: "Wait..."
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    //... the magic happens here
    let notes = await syncUpload(this.props.api, this.props.write, [...this.state.notes], confirmation);

    // After successful sync Operation we also update the state
    this.setState({
      notes: notes,
      proceedText: "Proceed",
      local: "Prioritize local edits",
      remote: "Prioritize remote edits"
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    // Callback to Notes to update Note-elements for the enduser.
    this.props.updateNotes(notes);

    // Callback to render notes again
    this.props.hideNotes(false);

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

  render() {

    let renderNotes = [];
    let warning = false,
        warningCount = 0;

    if (this.props.hideContent === true) {

      for (let note of this.state.notes) {

        // We will warn the user if there is a mismatch.
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
    // <div style={{ marginLeft: "2vw", marginRight: "2vw"}}>{message}</div>

    // We render this if the content should be visible (we are synchronizing).
    let content = this.props.hideContent ?
    <div>
      <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={() => this.synchronize()}></input></div>
      <div className="aboutLayer">
      <div><p style={{ marginBottom: "2vw" }}>Synchronizing ({this.state.notes.length} notes)...</p></div>
      {warning ? <h2>Remote database contains more recent edits!</h2>:<p style={{ marginTop: "5%"}}>It seems that there are no mismatches between remote and local. Click button to proceed.</p>}
      {warning ? <table>
        <thead>
          <tr><th>Local Text</th><th>Remote Text</th><th>Title, local => remote</th><th>Unique ID</th></tr>
       </thead>
       <tbody>
        {renderNotes}
       </tbody>
      </table>:null}
      {warning ?
        <div className="syncButtons">
          <button className="tallennus" onClick={() => this.upload(1)}>{this.state.local}</button>
          <button className="tallennus" onClick={() => this.upload(0)}>{this.state.remote}</button>
          {this.props.status}
        </div>
      :<div className="syncButtons"><button className="tallennus" onClick={() => this.upload(1)}>{this.state.proceedText}</button></div>}
    </div>
    </div> :
    // And this if the content is not visible.
    <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={() => this.synchronize()}></input></div>;

    return <div>{content}</div>;
  }
}

export default Synchronize;
