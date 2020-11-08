import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js';
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { styles } from '../../assets/style/styles.js';

// Import Functions
import {sortNotes} from '../functions/sortNotes.js';
import {calcOrder} from '../functions/calcOrder.js';
import {noteTemplate} from '../functions/noteTemplate.js';

// Import Colors
import {colors} from '../../assets/colors/color.js';

// Import Images
import scribbleSquare from '../../assets/images/scribbleSquare.png';
import addNote from '../../assets/images/addNote.png'
import sync from '../../assets/images/synchronizeNotes.png'

// API Constants
const API = "http://localhost:9000/notes"; // Base address...
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
    //let loadNotes = handleLocalStorage([]);

    this.state = {
      notes: [],
      colors: clonedColors,
      hideNotes: false
    }

    this.addNew = this.addNew.bind(this);
    this.delete = this.delete.bind(this);
    this.fetchRandomColor = this.fetchRandomColor.bind(this);
    this.notesVisibility = this.notesVisibility.bind(this);
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
    //clonedNotes = handleLocalStorage(clonedNotes);
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

  /*
  * Callback function (used from Synchronize Component)
  * Just to indicate if Notes should be rendered at the moment or not.
  */
  notesVisibility(visibility) {
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
  * When a little up or down arrow is clicked (in Note component),
  * This function will be called as a callback.
  */
  order(direction, order) {
    // First we sort notes to make absolutely sure they are in Descending order.
    let notes = sortNotes([...this.state.notes], false);
    // Then we swap positions of two notes.
    notes = calcOrder(direction, order, notes);

    // To make sure changes are stored...
    //notes = handleLocalStorage(notes);
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
    //clonedNotes = handleLocalStorage(clonedNotes);
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
    //notes = handleLocalStorage(notes);
    this.setState({ notes: notes, active: true },
      function() {
        this.updateItem(this.state);
      }.bind(this));

  }

  /*
  * To remove an individual node from the client-side.
  */
  delete(order) {
    let clonedNotes = [...this.state.notes];
    for (let i = 0; i < clonedNotes.length; i++) {
      if (clonedNotes[i].order === order) {
        // We first synchronize the deletion with the ENDPOINT DATABASE..
        this.syncDelete(clonedNotes[i].time);
        // Then we make sure to remove it from localStorage as well...
        //localStorage.removeItem(clonedNotes[i].time);
        // And lastly splice it off from the array..
        clonedNotes.splice(i, 1);
      }
      // ...and UPDATE the state.
    }
    this.setState({ notes: clonedNotes });
  }

  render() {

    let notes = [...this.state.notes];
    let renderNotes = [];

    //if (!this.state.hideNotes) {
      for (let note of notes) {
        renderNotes.push(<Note changeOrder={this.order} delete={this.delete} colors={this.state.colors}
          order={note.order} time={note.time} title={note.title}
          onSubmit={this.onSubmit} text={note.text} color={note.color} key={note.time} />);
      }

      console.log(renderNotes);
    //}

    //<Synchronize api={API} write={WRITE} notes={this.state.notes} updateNotes={this.updateNotes} notesVisibility={this.notesVisibility} />
    try {
      return (
        <View style={styles.sectioncontainer2}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
            <Image source={scribbleSquare} style={styles.logo}/>
            <Text style={styles.appTitle}>Scribble 2000</Text>
            <View><TouchableOpacity onPress={() => this.addNew()}><Image source={addNote} style={styles.add}/></TouchableOpacity></View>
            <View><TouchableOpacity onPress={() => this.addNew()}><Image source={sync} style={styles.add}/></TouchableOpacity></View>
          </View>
          <View style={styles.body}>
              {renderNotes}
          </View>
        </View>);
    } catch(e) {
      return (<View><Text>Error occurred!</Text></View>);
    }
  }
}

export default Notes;
