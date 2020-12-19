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
      warning: false,
      status: '',
    }

    this.synchronize = this.synchronize.bind(this);
    this.upload = this.upload.bind(this);
  }

  /*
  * Here we call two functions to synchronize notes between the client and endpoint.
  */
  async synchronize(notes) {

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

    // Callback to Notes.js
    this.props.updateNotes(clonedNotes);

    for (let note of clonedNotes) {

      // We will warn the user if there is a mismatch.
      if (note.warning === true) {

        if (note.color.localeCompare(note.colorRemote) === 0 && note.text.localeCompare(note.textRemote) === 0 && note.title.localeCompare(note.titleRemote) === 0) {
          continue;
        }
        warningNotes.push(note);

      }
    }

    if (Array.isArray(warningNotes) && warningNotes.length > 0) {
      // Let's not render the notes for time being
      this.props.hideNotes(true);
      warning = true;
    }

    this.setState({
      warning: warning,
      warningNotes: warningNotes,
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    if (warning === false) {
      // we prefer local more recent updates
      this.upload(true);
    }
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
    //this.props.updateNotes(notes);

    // Callback to render notes again
    this.props.hideNotes(false);
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
    //this.sync = setInterval(() => { this.synchronize(this.props.notes) }, 10000);
  }

  componentWillUnmount() {
    //clearInterval(this.sync);
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
    <div>
      <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={() => this.synchronize()}></input></div>
      <div className="aboutLayer">
      {this.state.warning ? <h2>Remote database contains more recent edits!</h2>:null}
      {this.state.warning ? <div><table>
        <thead>
          <tr><th>Local Text</th><th>Remote Text</th><th>Title, local => remote</th></tr>
       </thead>
       <tbody>
        {renderNotes}
       </tbody>
      </table>
      <div className="syncButtons">
        <button className="tallennus" onClick={() => this.upload(true)}>Prioritize local edits</button>
        <button className="tallennus" onClick={() => this.upload(false)}>Prioritize remote edits</button>
        {this.props.status}
      </div>
      </div>
      :null}
    </div>
    </div> :
    // And this if the content is not visible.
    <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={() => this.synchronize()}></input></div>;

    return <div><p style={{ marginLeft: '1vh', marginTop: '7vh', fontSize: '10px', position: 'absolute', color: 'green', fontWeight: '800', backgroundColor: 'transparent'}}>{this.state.status}</p> {content}</div>;
  }
}

export default Synchronize;
