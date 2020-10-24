import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js';

// Import Functions
import {sortNotes} from '../functions/sortNotes.js';
import {calcOrder} from '../functions/calcOrder.js';
import {calcPosition} from '../functions/calcPosition.js';
import {handleLocalStorage} from '../functions/handleLocalStorage.js';
import {noteTemplate} from '../functions/noteTemplate.js';
import {handleErrors} from '../functions/handleErrors.js';

// Import Colors
import {colors} from '../../assets/colors/color.js';

// Import Images
import scribbleSquare from '../../assets/images/scribbleSquare.png';
import addNote from '../../assets/images/addNote.png';
import synchronizeNotes from '../../assets/images/synchronizeNotes.png';


// API Constants
const API = "http://localhost:9000/notes";
const WRITE = "/write/";
const EDIT = "/edit/";
const DELETE = "/delete/";
const JOKE = 'https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist&type=single';

class Notes extends React.Component {
  constructor(props) {
    super(props);

    let clonedColors = JSON.parse(JSON.stringify(colors));
    let loadNotes = handleLocalStorage([]);

    this.state = { notes: loadNotes, colors: clonedColors, active: 0 }

    this.add = this.add.bind(this);
    this.call = this.call.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.fetchRandomColor = this.fetchRandomColor.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.order = this.order.bind(this);
    this.delete = this.delete.bind(this);
    this.synchronize = this.synchronize.bind(this);
  }


  async componentDidMount() {
    return;
    try {
      let array = [];
      fetch(API)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        array.push(item)
      }))
      .then(this.setState({notes: array}))

   } catch (error) {
     console.log(error);
   }
  }

  synchronize() {
    this.syncNotes();
    return;
    try {
      let clonedNotes = [...this.state.notes];
      fetch(API)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        if (!clonedNotes.filter({ time: item.time })) {
          clonedNotes.push(item);
        }
      }))
      .then(this.setState({notes: clonedNotes}, function () {
          this.updateItem(this.state);
      }.bind(this)));

   } catch (error) {
     console.log(error);
   }

  }

  syncNotes() {
    for (let note of this.state.notes) {
      const URL = API + WRITE + note.time + '/' + note.order + '/' + note.title + '/' + note.text + '/' +  note.left + '/' + note.top + '/' + note.color;
      console.log(URL);      
    }

    return;
    try {
      let clonedNotes = [...this.state.notes];
      fetch(API + WRITE)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        if (!clonedNotes.filter({ time: item.time })) {
          clonedNotes.push(item);
        }
      }))
      .then(this.setState({notes: clonedNotes}, function () {
          this.updateItem(this.state);
      }.bind(this)));

   } catch (error) {
     console.log(error);
   }
  }

  //käytännössä varmistetaan, että tila varmasti on saatu tallennettua
  //eikä tule tilannetta, jossa päivitykset laahaavat yhden askeleen perässä.
  updateItem() {
    this.setState(this.state);
  }

  /*
  * Responsible for adding a template for new note.
  */
  async add() {
    let newNote = {};
    // To find out the max Id value of existing notes
    let time = new Date();
    let color = this.fetchRandomColor();
    let joke = 'sample message';

    try {
      joke = await this.joke();
    } catch(error) {
      console.error(error);
    }

    if (Array.isArray(this.state.notes) && this.state.notes.length) {
      let maxOrder = Math.max.apply(Math,this.state.notes.map(function(o){return o.order;}));
      newNote = noteTemplate(time.getTime(), maxOrder+1, color, joke);
    } else {
      newNote = noteTemplate(time.getTime(), 1, color, joke);
    }

    let clonedNotes = [...this.state.notes]; //parseNotes(this.state.notes);
    clonedNotes.push(newNote);
    clonedNotes = handleLocalStorage(clonedNotes);

    this.setState({ notes: clonedNotes });
  }

  async joke() {
    try {
      const response = await fetch(JOKE, {
          method: 'GET',
      });

      const joke = await response.json();
      return joke.joke;
    } catch (error) {
      return "Sample note";
    }

  }

  call(order, callBack) {
    this.setState({active: order});
    callBack();
  }

  dragOver(e) {
    e.preventDefault();
  }

  /*
  * Fetching random color.
  */
  fetchRandomColor() {
    let random = Math.floor(Math.random() * this.state.colors.length);
    return JSON.parse(JSON.stringify(this.state.colors[random].color));
  }

  onDrop(e) {
    e.preventDefault();
    let order = parseInt(e.dataTransfer.getData("text/plain"));
    console.log(order);
    let clonedNotes = [...this.state.notes];
    clonedNotes = calcPosition(clonedNotes, e.clientX, e.clientY, order);
    clonedNotes = handleLocalStorage(clonedNotes);

    this.setState({ notes: clonedNotes });

  }

  order(direction, order) {
    let notes = sortNotes([...this.state.notes]);
    notes = calcOrder(direction, order, notes);
    notes = handleLocalStorage(notes);
    this.setState({ notes: notes, active: 0 });
  }

  onSubmit(note) {

    let clonedNotes = [...this.state.notes];

    for (let n of clonedNotes) {
      if (n.order === note.order) {
        n.text = note.text;
        n.title = note.title;
        n.color = note.color;
      }
    }
    clonedNotes = handleLocalStorage(clonedNotes);
    this.setState({ notes: clonedNotes, active: 0 });
  }

  delete(order) {
    let confirmRemove = window.confirm("Do you want to remove the note?");
    if (confirmRemove) {
      let clonedNotes = [...this.state.notes];
      for (let i = 0; i < clonedNotes.length; i++) {
        if (clonedNotes[i].order === order) {
          clonedNotes.splice(i, 1);
          localStorage.removeItem(order);
        }
      }

      this.setState({ notes: clonedNotes });
    }

  }

  render() {

    let notes = [...this.state.notes];
    let renderNotes = [];

    for (let note of notes) {
      renderNotes.push(<Note changeOrder={this.order} delete={this.delete} colors={this.state.colors}
        order={note.order} time={note.time} title={note.title} call={this.call} onSubmit={this.onSubmit} text={note.text} color={note.color}
        top={note.top} left={note.left} key={note.time} />);
    }

    return (
      <div className="Full" onDrop={e => this.onDrop(e)} onDragOver={e => this.dragOver(e)}>
      <div className="headerRow">
        <div id="logo"><img src={scribbleSquare} alt="Cancel" width="48" height="48" /> <h1>Scribble 2000</h1></div>
        <input type="image" src={addNote} className="add" title="Add new Note" width="48" height="48" alt="Add Note" onClick={this.add}></input>
        <input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize" onClick={this.synchronize}></input>
        <Synchronize API={this.API} SEND={this.SEND} />
      </div>
      <div id="flex">{renderNotes}</div>
      </div>);
  }

}

export default Notes;
