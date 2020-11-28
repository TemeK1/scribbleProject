import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js';

// Import Functions
import {sortNotes} from '../functions/sortNotes.js';
import {calcOrder} from '../functions/calcOrder.js';
import {calcPosition} from '../functions/calcPosition.js';
import {handleLocalStorage} from '../functions/handleLocalStorage.js';
import {noteTemplate} from '../functions/noteTemplate.js';

// Import Colors
import {colors} from '../../assets/colors/color.js';

// Import Images
import scribbleSquare from '../../assets/images/scribbleSquare.png';
import addNote from '../../assets/images/addNote.png'

// API Constants
const API = "https://scribble2000endpoint.oa.r.appspot.com/notes"; // Base address...
const WRITE = "/write/"; // ...for Writing and Editing
const DELETE = "/delete/"; // ... for Deleting
const JOKE = "https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist&type=single";

/*
* Primary interface component of the application.
* Responsible for handling API connections, and rendering and handling single notes.
* Through and through the time attribute (Note creation time in milliseconds since 1970) works as a unique identificator for a single note.
*/
class Notes extends React.Component {
  constructor(props) {
    super(props);

    let clonedColors = JSON.parse(JSON.stringify(colors));
    let loadNotes = handleLocalStorage([]);

    this.state = {
      notes: loadNotes,
      colors: clonedColors,
      hideNotes: false
    }

    this.addNew = this.addNew.bind(this);
    this.delete = this.delete.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.fetchRandomColor = this.fetchRandomColor.bind(this);
    this.hideNotes = this.hideNotes.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.order = this.order.bind(this);
    this.updateNotes = this.updateNotes.bind(this)
  }

  /*
  * This is called upon when an individual note is removed.
  * With this we immediately make sure that the Note is also removed from the endpoint DATABASE, and not only from the client-side.
  */
  syncDelete(time) {
    try {
      fetch(API + DELETE + time)
      .then(response => response.json())
      .then(data => console.log(data));
    } catch (error) {
      console.log(error);
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
  * Responsible for handling the creation process of a new note
  */
  async addNew() {
    let newNote = {};
    // This timestamp will be used to get a unique timestamp for the new note
    let time = new Date();
    let color = this.fetchRandomColor();
    // if we can't succesfully fetch the JOKE API, we use this as a template message
    let joke = 'sample message';

    try {
      // First we see if we manage to find A GREAT JOKE
      joke = await this.joke();
    } catch(error) {
      console.error(error);
    }

    // If we already have some notes..
    if (Array.isArray(this.state.notes) && this.state.notes.length) {
      let maxOrder = Math.max.apply(Math,this.state.notes.map(function(o){return o.order;}));
      newNote = noteTemplate(time.getTime(), maxOrder+1, color, joke);
      // If we don't...
    } else {
      newNote = noteTemplate(time.getTime(), 1, color, joke);
    }

    // And update whatever needs to be updated (state, localStorage)
    let clonedNotes = [...this.state.notes];
    clonedNotes.push(newNote);
    clonedNotes = handleLocalStorage(clonedNotes);
    this.setState({ notes: clonedNotes },
      function() {
      this.updateItem(this.state);
      }.bind(this));
  }

  /*
  * Function for fetching a random PROGRAMMING JOKE from JOKE API
  */
  async joke() {
    try {
      const response = await fetch(JOKE, {
          method: 'GET',
      });

      const joke = await response.json();
      return joke.joke;
    } catch (error) {
      return "sample note";
    }

  }

  dragOver(e) {
    e.preventDefault();
  }

  /*
  * Callback function (used from Synchronize Component)
  * Just to indicate if Notes should be rendered at the moment or not.
  */
  hideNotes(visibility) {
    this.setState({
      hideNotes: visibility
    });
  }

  /*
  * Fetching random color from available colors options (this.state.colors)
  */
  fetchRandomColor() {
    let random = Math.floor(Math.random() * this.state.colors.length);
    return JSON.parse(JSON.stringify(this.state.colors[random].color));
  }

  /*
  * This will be called when a Note is dragged and then dropped on wide screen edition
  */
  onDrop(e) {
    e.preventDefault();
    // Order number of dragged note is parsed from dataTransfer.
    let time = parseInt(e.dataTransfer.getData("text/plain"));
    let clonedNotes = [...this.state.notes];
    // We call calcPosition to calculate an absolute top- and left position for dragged note
    clonedNotes = calcPosition(clonedNotes, e.clientX, e.clientY, time);

    // Make sure changes are stored...
    clonedNotes = handleLocalStorage(clonedNotes);
    this.setState({ notes: clonedNotes });

  }

  /*
  * When a little up or down arrow is clicked (in Note component),
  * This function will be called as a callback.
  */
  order(direction, order) {
    // First we sort notes to make absolutely sure those are in Descending order.
    let notes = sortNotes([...this.state.notes], false);
    // Then we swap positions of two notes.
    notes = calcOrder(direction, order, notes);

    // To make sure changes are stored...
    notes = handleLocalStorage(notes);
    this.setState({ notes: notes });
  }

  /*
  * Callback function for when individual Note
  * is edited and submitted.
  */
  onSubmit(note) {
    let clonedNotes = [...this.state.notes];

    for (let n of clonedNotes) {
      if (n.time === note.time) {
        n.text = note.text;
        n.title = note.title;
        n.color = note.color;
        n.lastEdited = new Date().getTime();
      }
    }

    // To make sure changes are stored...
    clonedNotes = handleLocalStorage(clonedNotes);
    this.setState({ notes: clonedNotes },
      function() {
      this.updateItem(this.state);
      }.bind(this));
  }

  /*
  * Callback function (used from Synchronize Component)
  * Makes sure that the after the syncronization
  * edits are mirrored to the component's state and localStorage.
  */
  updateNotes(notes) {
    notes = handleLocalStorage(notes);
    this.setState({ notes: notes, active: true },
      function() {
        this.updateItem(this.state);
      }.bind(this));
  }

  /*
  * To remove an individual node from the client-side.
  */
  delete(time) {
    let confirmRemove = window.confirm("Do you want to remove the note?");
    if (confirmRemove) {
      let clonedNotes = [...this.state.notes];
      for (let i = 0; i < clonedNotes.length; i++) {
        if (clonedNotes[i].time === time) {
          // We first synchronize the deletion with the ENDPOINT DATABASE..
          this.syncDelete(clonedNotes[i].time);
          // Then we make sure to remove it from localStorage as well...
          localStorage.removeItem(clonedNotes[i].time);
          // And lastly splice it off from the array..
          clonedNotes.splice(i, 1);
          break;
        }
      }
      // ...and UPDATE the state.
      this.setState({ notes: clonedNotes });
    }
  }

  render() {

    let notes = [...this.state.notes];
    let renderNotes = [];
    let flexStyle = "";

    if (!this.state.hideNotes) {
      for (let note of notes) {
        renderNotes.push(<Note changeOrder={this.order} delete={this.delete} colors={this.state.colors}
          order={note.order} time={note.time} title={note.title} onSubmit={this.onSubmit} text={note.text} color={note.color}
          top={note.top} left={note.left} key={note.time} />);
      }
    } else {
      flexStyle = "flexHide";
      renderNotes.push(<div key={"qwerty123"}><p style={{ textAlign: "center" }}>Synchronizing...</p></div>);
    }

    try {
      return (
        <div className="Full" onDrop={e => this.onDrop(e)} onDragOver={e => this.dragOver(e)}>
          <div className="headerRow">
            <Synchronize api={API} write={WRITE} notes={this.state.notes} updateNotes={this.updateNotes} hideNotes={this.hideNotes} />
            <div id="logo"><img src={scribbleSquare} alt="Scribble 2000" width="48" height="48" /> <h1>Scribble 2000</h1></div>
            <input type="image" src={addNote} className="add" title="Add new Note" width="48" height="48" alt="Add Note" onClick={this.addNew}></input>
          </div>
          <div id="flex" className={flexStyle}>{renderNotes}</div>
        </div>);
    } catch(e) {
      return (<div>Error occurred!</div>);
    }
  }

}

export default Notes;
