import React from 'react';
import Comparison from './Comparison.js';

// Import Functions
import {syncDownload} from '../functions/syncDownload.js';
import {syncUpload} from '../functions/syncUpload.js';

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
  }

  /*
  * Here we call two functions to synchronize notes between the client and endpoint.
  */
  synchronize() {
    this.swap();
    let clonedNotes = syncDownload(this.props.api, [...this.state.notes]);
    console.log(clonedNotes);

    this.setState({
      notes: clonedNotes
    }, function() {
      this.updateItem(this.state);
    }.bind(this));

    //syncUpload(this.props.api, this.props.write, clonedNotes);
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
      this.setState({reveal: true});
    } else {
      this.setState({reveal: false});
    }

  }

  render() {

    let renderNotes = [];
    if (this.state.reveal) {

      for (let note of this.state.notes) {
        renderNotes.push(<Comparison color={note.color}
          order={note.order} time={note.time} lastEdited={note.lastEdited} title={note.title} text={note.text}
          top={note.top} left={note.left}  colorRemote={note.colorRemote}
          orderRemote={note.orderRemote} timeRemote={note.timeRemote} lastEditedRemote={note.lastEditedRemote}
          titleRemote={note.titleRemote} textRemote={note.textRemote}
          topRemote={note.topRemote} leftRemote={note.leftRemote} warning={note.warning} key={note.time} />);
      }

    }

    let message = renderNotes.length ? "WARNING! Some of the remote content has been edited more recently than your local notes. If you confirm to remotely sync messages, you will lose some remote content (a text with red background). Press 'OK' to proceed, and 'Cancel' to keep remote edits (YOU WILL LOSE LOCAL VERSION = GREEN ONES). This action is irreversible." : "asd";

    // We render this if the content is visible.
    let content = this.state.reveal ?
    <div>
    <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={this.synchronize}></input></div>
    <div className="aboutLayer">
    <table>
    <thead>
    <tr><th>Local Text</th><th>Remote Text</th><th>Title (local => remote)</th><th>Unique ID</th></tr>
    </thead>
    <tbody>
    {renderNotes}
    </tbody>
    </table>
    <div style={{ marginLeft: "2vw"}}>{message}</div>
    </div></div> :
    // And this if the content is not visible.
    <div><input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize notes with database" onClick={this.synchronize}></input></div>;

    return <div>{content}</div>;
  }
}

export default Synchronize;
