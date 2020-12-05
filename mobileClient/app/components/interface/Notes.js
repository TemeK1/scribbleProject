import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js';
const Realm = require('realm');

// Import necessary React Native Components
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Import CSS
import { styles } from '../../assets/style/styles.js';

// Import Schema.
import * as Schema from '../realm/Schema.js';

// Import Functions
import {sortNotes} from '../functions/sortNotes.js';
import {calcOrder} from '../functions/calcOrder.js';
import {noteTemplate} from '../functions/noteTemplate.js';
import {handleNotes} from '../functions/handleNotes.js';

// Import Colors
import {colors} from '../../assets/colors/color.js';

// Image Images
var scribbleSquare = require('../../assets/images/scribbleSquare.png');
var addNote = require('../../assets/images/addNote.png');

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

    this.state = {
      notes: [],
      colors: clonedColors,
      hideNotes: false,
      orderChanged: false
    };

    this.addNew = this.addNew.bind(this);
    this.delete = this.delete.bind(this);
    this.fetchRandomColor = this.fetchRandomColor.bind(this);
    this.hideNotes = this.hideNotes.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.order = this.order.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.storeLocal = this.storeLocal.bind(this);
  }

  /*
  * After the component has been mounted, we will fetch the notes
  * from a local database.
  */
  componentDidMount() {
    Realm.open({schema: [Schema.Note]})
    .then(realm => {
       // Fetch notes from local Realm database
       let notes = realm.objects('Note');
       currentNotes = handleNotes(notes);
       this.setState({ realm: realm, notes: currentNotes });
     });
  }

  /*
  * This happens when the component will be unmounted soon at the end of its lifecycle.
  * Then the last connection to Realm wil be terminated.
  */
  componentWillUnmount() {
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  /*
  * This is called upon when an individual note is removed.
  * With this we immediately make sure that the Note is also removed from the endpoint DATABASE, and not only from the client-side.
  */
  syncDelete(time) {
    try {
      fetch(API + DELETE + time)
      .then(response => response.json());
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

    // And update whatever needs to be updated (state, Realm)
    let clonedNotes = [...this.state.notes];
    clonedNotes.push(newNote);
    // Realm storing
    this.storeLocal(clonedNotes);
    this.setState({ notes: clonedNotes },
      function() {
      this.updateItem(this.state);
      }.bind(this));
  }

  /*
  * Notes will be stored in a local Realm database.
  */
  storeLocal(notes) {
    Realm.open({schema: [Schema.Note]})
    .then(realm => {
        realm.write(() => {
          let realmNotes = realm.objects('Note');

          for (let i = 0; i < notes.length; i++) {
            let newNeeded = true;
            let editNote = null;
            for (let j = 0; j < realmNotes.length; j++) {
              if (realmNotes[j].time == notes[i].time) {
                newNeeded = false;
                editNote = realmNotes[j];
                break;
              }
            }
            // Here we store a new note in Realm database if it doesn't exist already
            if (newNeeded === true) {
              const nNote = realm.create('Note', {
                time: notes[i].time,
                lastEdited: notes[i].lastEdited,
                order: notes[i].order,
                title: notes[i].title,
                text: notes[i].text,
                color: notes[i].color,
                left: notes[i].left,
                top: notes[i].top
              });
            } else {
              // However, if the note exists, we shall update its values.
              editNote.lastEdited = notes[i].lastEdited;
              editNote.order = notes[i].order;
              editNote.title = notes[i].title;
              editNote.text = notes[i].text;
              editNote.color = notes[i].color;
              editNote.left = notes[i].left;
              editNote.top = notes[i].top;
            }
          }
        });
      this.setState({ realm: realm });
      realm.close();
    });
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
  hideNotes(visibility) {
    this.setState({
      hideNotes: visibility
    },
    function() {
    this.updateItem(this.state);
    }.bind(this));
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
    // Realm storing
    this.storeLocal(notes);
    this.setState({ notes: notes, orderChanged: true },
      function() {
        this.updateItem(this.state);
      }.bind(this));
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
    // Realm storing
    this.storeLocal(clonedNotes);
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
    this.storeLocal(notes);
    this.setState({ notes: notes, orderChanged: false },
      function() {
        this.updateItem(this.state);
      }.bind(this));
  }

  /*
  * To remove an individual node from the client-side.
  */
  delete(time) {
    let clonedNotes = [...this.state.notes];
    for (let i = 0; i < clonedNotes.length; i++) {
      if (clonedNotes[i].time === time) {
        // We first synchronize the deletion with the ENDPOINT DATABASE..
        this.syncDelete(clonedNotes[i].time);
        // Then we make sure to remove it from local database as well...

       Realm.open({schema: [Schema.Note]})
       .then(realm => {
           realm.write(() => {
             let notes = realm.objects('Note');
             for (let j = 0; j < notes.length; j++) {
               if (notes[j].time == clonedNotes[i].time) {
                 realm.delete(notes[j]);
                 break;
               }
             }

             // And lastly splice it off from the array..
             clonedNotes.splice(i, 1);
             // ...and UPDATE the state.
             this.setState({ realm: realm, notes: clonedNotes });
           });
           realm.close();
        });
        break;
      }
    }
  }

  render() {

    let notes = [...this.state.notes];
    notes = sortNotes(notes);
    let renderNotes = [];

    // All notes to be rendered.
    if (!this.state.hideNotes) {
      for (let note of notes) {
        renderNotes.push(<Note lastEdited={note.lastEdited} changeOrder={this.order} delete={this.delete} colors={this.state.colors}
          order={note.order} time={note.time} title={note.title}
          onSubmit={this.onSubmit} text={note.text} color={note.color} key={note.time} />);
      }
    }

    //{this.state.hideNotes ? <View><Text style={{ textAlign: "center", marginBottom: 2 }}>Synchronizing...</Text></View>:null}

    try {
      return (
        <View>
          <View>
            <View style={{ flexDirection: "row"}}>
              <View style={{ flexDirection: "column", flex: 0.6, flexWrap: 'wrap' }}><Synchronize api={API} write={WRITE} notes={this.state.notes} orderChanged={this.state.orderChanged} updateNotes={this.updateNotes} hideNotes={this.hideNotes} hideContent={this.state.hideNotes} /></View>
              <View><Image source={scribbleSquare} style={styles.logo} /></View>
              <View><Text style={styles.appTitle}>Scribble 2000</Text></View>
              <View><TouchableOpacity onPress={() => this.addNew()}><Image source={addNote} style={styles.add}/></TouchableOpacity></View>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.notes}>
              {renderNotes}
            </View>
         </View>
       </View>);
    } catch(e) {
      return (<View><Text>Error occurred!</Text></View>);
    }
  }
}

export default Notes;
