import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js'
import {colors} from '../../assets/colors/color.js';
import scribbleSquare from '../../assets/images/scribbleSquare.png';
import addNote from '../../assets/images/addNote.png';
import synchronizeNotes from '../../assets/images/synchronizeNotes.png';

const API = "http://localhost:9000/notes";
const SEND = "http://localhost:9000/notes/send";

class Notes extends React.Component {
  constructor(props) {
    super(props);

    let clonedColors = JSON.parse(JSON.stringify(colors));
    let loadNotes = [];
    loadNotes = this.localStorage(loadNotes);
    //localStorage.clear();


     this.state = {
       "notes": loadNotes,
       "colors": clonedColors,
       "active": 0
     }

     this.parseNotes = this.parseNotes.bind(this);
     this.add = this.add.bind(this);
     this.call = this.call.bind(this);
     this.dragOver = this.dragOver.bind(this);
     this.localStorage = this.localStorage.bind(this);
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
      let clonedNotes = this.parseNotes();
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

  localStorage(loadNotes) {

    Storage.prototype.getObj = function(key) {
      return JSON.parse(this.getItem(key));
    }

    Storage.prototype.setObj = function(key, obj) {
      return this.setItem(key,(obj));
    }

    if (loadNotes) {
      for (let n of loadNotes) {
        localStorage.setObj(n.id, JSON.stringify({
          "id": n.id,
          "order": n.order,
          "title": n.title,
          "text": n.text,
          "left": n.left,
          "top": n.top,
          "color": n.color,
          "time": n.time}));
      }

      for (let i = 0; i < localStorage.length; i++) {
        let obj = localStorage.getObj(localStorage.key(i));

        if (isNaN(obj.id) === false) {
          loadNotes.push({
            "id":obj.id,
            "order": obj.order,
            "title": obj.title,
            "text": obj.text,
            "left": obj.left,
            "top": obj.top,
            "color": obj.color,
            "time": obj.time
          });
        }
      }

      for (let i = 0; i < loadNotes.length; i++) {
        for (let j = loadNotes.length -1; j > i; j--) {
          if (loadNotes[i].id === loadNotes[j].id) {
            loadNotes.splice(j, 1);
          }
        }
      }

      return loadNotes;
    }

    return [];
  }

  add() {
    let id = 1;
    if (this.state.notes) {
      id = this.state.notes.length + 1;
    }

    let newNote = {"id": id, "order": id, "title": "sample titleX", "text": "sample textX", "left": "25%", "top": "25%", "color": "#AFD5AA", "time": new Date()};
    let clonedNotes = this.parseNotes();

    clonedNotes.push(newNote);

    clonedNotes = this.localStorage(clonedNotes);

    this.setState({
      notes: clonedNotes
    });
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

    let clonedNotes = this.parseNotes();
    for (let i = 0; i < clonedNotes.length; i++) {
      if (clonedNotes[i].id === id) {
        let top = (e.clientY / window.innerHeight) * 100;
        let left = (e.clientX / window.innerWidth) * 100;
        clonedNotes[i].top = top + "%";
        clonedNotes[i].left = left + "%";
      }
    }

    clonedNotes = this.localStorage(clonedNotes);

    this.setState({
      notes: clonedNotes
    });

  }

  order(direction, order) {
    let notes = this.parseNotes();

    if (direction === 1) {
      for (let i = notes.length -1; i >= 0; i--) {
        if (notes[i].order === order) {
          for (let j = 0; j < notes.length; j++) {
            if ((notes[j].order - order) === 1) {
              notes[i].order = notes[j].order;
              notes[j].order = order;
              break;
            }
          }
          break;
        }
      }
    } else {
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].order === order) {
          for (let j = 0; j < notes.length; j++) {
            if ((order - notes[j].order) === 1) {
              notes[i].order = notes[j].order;
              notes[j].order = order;
              break;
            }
          }
          break;
        }
      }
    }

    notes = this.localStorage(notes);
    this.setState({
      notes: notes
    });
  }

  onSubmit(note) {

    let clonedNotes = this.parseNotes();

    for (let n of clonedNotes) {
      if (n.id === note.id) {
        n.text = note.text;
        n.title = note.title;
        n.color = note.color;
      }
    }
    clonedNotes = this.localStorage(clonedNotes);
    this.setState({notes: clonedNotes});
  }

  delete(id) {
    let confirmRemove = window.confirm("Do you want to remove the note?");
    if (confirmRemove) {
      let clonedNotes = this.parseNotes();
      for (let i = 0; i < clonedNotes.length; i++) {
        if (clonedNotes[i].id === id) {
          clonedNotes.splice(i, 1);
          localStorage.removeItem(id);
        }
      }

      this.setState({
        notes: clonedNotes
      });
    }

  }

  parseNotes() {
    let notes = [];
    if (this.state.notes) {
      for (let note of this.state.notes) {
        notes.push(JSON.parse(JSON.stringify(note)));
      }
    }
    return notes;
  }

  render() {

    let notes = this.parseNotes();
    let renderNotes = [];

    for (let note of notes) {
      renderNotes.push(<Note changeOrder={this.order} delete={this.delete} colors={this.state.colors}
        order={note.order} id={note.id} title={note.title} call={this.call} onSubmit={this.onSubmit} text={note.text} color={note.color}
        top={note.top} left={note.left} key={1000 * Math.random()} />);
    }

    return (
      <div className="Full" onDrop={e => this.onDrop(e)} onDragOver={e => this.dragOver(e)}>
      <div className="headerRow">
        <div id="logo"><img src={scribbleSquare} alt="Cancel" width="48" height="48" /> <h1>Scribble 2000</h1></div>
        <input type="image" src={addNote} className="add" title="Add new Note" width="48" height="48" alt="Add Note" onClick={this.add}></input>
        <input type="image" src={synchronizeNotes} className="synchronize" width="48" height="48" alt="Synchronize notes with database" title="Synchronize" onClick={this.synchronize}></input>
        <Synchronize API={this.API} SEND={this.SEND} />
      </div>
      <div id="flex">
         {renderNotes}
      </div>
      </div>);
  }

}

export default Notes;
