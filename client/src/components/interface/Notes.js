import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js';

// Import Functions
import {parseNotes} from '../functions/parseNotes.js';
import {calcOrder} from '../functions/calcOrder.js';
import {calcPosition} from '../functions/calcPosition.js';
import {handleLocalStorage} from '../functions/handleLocalStorage.js';
import {noteTemplate} from '../functions/noteTemplate.js';

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

class Notes extends React.Component {
  constructor(props) {
    super(props);

    let clonedColors = JSON.parse(JSON.stringify(colors));
    let loadNotes = handleLocalStorage([]);

    this.state = { notes: loadNotes, colors: clonedColors, active: 0 }

    this.add = this.add.bind(this);
    this.call = this.call.bind(this);
    this.dragOver = this.dragOver.bind(this);
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
    try {
      let clonedNotes = parseNotes(this.state.notes);
      fetch(API)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        clonedNotes.push(item)
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
  add() {
    let newNote = {};
    // To find out the max Id value of existing notes
    if (Array.isArray(this.state.notes) && this.state.notes.length) {
      let maxId = Math.max.apply(Math,this.state.notes.map(function(o){return o.id;}));
      let maxOrder = Math.max.apply(Math,this.state.notes.map(function(o){return o.order;}));
      newNote = noteTemplate(maxId+1, maxOrder+1);
    } else {
      newNote = noteTemplate(1, 1);
    }

    let clonedNotes = parseNotes(this.state.notes);

    clonedNotes.push(newNote);

    clonedNotes = handleLocalStorage(clonedNotes);

    this.setState({ notes: clonedNotes });
  }

  call(id, callBack) {
    this.setState({active: id});
    callBack();
  }

  dragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    e.preventDefault();
    let id = parseInt(e.dataTransfer.getData("text/plain"));
    let clonedNotes = parseNotes(this.state.notes);
    clonedNotes = calcPosition(clonedNotes, e.clientX, e.clientY, id);
    clonedNotes = handleLocalStorage(clonedNotes);

    this.setState({ notes: clonedNotes });

  }

  order(direction, order) {
    let notes = parseNotes(this.state.notes);
    notes = calcOrder(direction, order, notes);
    notes = handleLocalStorage(notes);
    this.setState({ notes: notes, active: 0 });
  }

  onSubmit(note) {

    let clonedNotes = parseNotes(this.state.notes);

    for (let n of clonedNotes) {
      if (n.id === note.id) {
        n.text = note.text;
        n.title = note.title;
        n.color = note.color;
      }
    }
    clonedNotes = handleLocalStorage(clonedNotes);
    this.setState({ notes: clonedNotes, active: 0 });
  }

  delete(id) {
    let confirmRemove = window.confirm("Do you want to remove the note?");
    if (confirmRemove) {
      let clonedNotes = parseNotes(this.state.notes);
      for (let i = 0; i < clonedNotes.length; i++) {
        if (clonedNotes[i].id === id) {
          clonedNotes.splice(i, 1);
          localStorage.removeItem(id);
        }
      }

      this.setState({ notes: clonedNotes });
    }

  }

  render() {

    let notes = parseNotes(this.state.notes);
    let renderNotes = [];

    for (let note of notes) {
      renderNotes.push(<Note changeOrder={this.order} delete={this.delete} colors={this.state.colors}
        order={note.order} id={note.id} title={note.title} call={this.call} onSubmit={this.onSubmit} text={note.text} color={note.color}
        top={note.top} left={note.left} key={note.id} />);
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
