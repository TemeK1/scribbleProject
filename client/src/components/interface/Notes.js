import React from 'react';
import Note from './Note.js';
import Synchronize from './Synchronize.js'
import {colors} from '../../assets/colors/color.js';

const API = "http://localhost:9000/notes";
const SEND = "http://localhost:9000/notes/send";

class Notes extends React.Component {
  constructor(props) {
    super(props);

    let clonedColors = JSON.parse(JSON.stringify(colors));


//if (localStorage.getItem("init")) {
//  let obj = JSON.parse(localStorage.getItem("init"));
//  if (obj) {
//  }
//} else {
//   localStorage.setItem("init", true);
//   loadNotes = [
//   {
//     "id": 1,
//     "title": "Groceries",
//     "text": "Buy Case of Nuka Cola, Nachos, Milk, Coffee, Candy and Gouda Cheese.",
//     "left": "20%",
//     "top": "20%",
//     "color": "green",
//     "time": null
//   },
//   {
//     "id": 2,
//     "title": "Lunch Meeting at Harald",
//     "text": "Tomorrow, at 12 o'clock sharp.",
//     "left": "50%",
//     "top": "10%",
//     "color": "pink",
//     "time": null
//   },
//   {
//         "id": 3,
//         "title": "ToDo for Notes Web-App:",
//         "text": "Timestamps. Future Dream: Database API",/
//         "left": "50%",
//         "top": "50%",
//         "color": "#63ebc4",
//         "time": null
//        }]
//   }

    //let loadNotes = this.localStorage(loadNotes);
        //localStorage.clear();

    let loadNotes = [{
         "order": 1,
         "title": "Lunch Meeting at Harald",
         "text": "Tomorrow, at 12 o'clock sharp.",
         "left": "50%",
         "top": "10%",
         "color": "pink",
         "time": null
       }
    ]

     this.state = {
       "notes": loadNotes,
       "colors": clonedColors,
       "active": 0,
       "apiResponse": null
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

  localStorage(loadNotes) {

    Storage.prototype.getObj = function(key) {
      return JSON.parse(this.getItem(key));
    }

    Storage.prototype.setObj = function(key, obj) {
      return this.setItem(key,(obj));
    }

    if (loadNotes) {
      for (let n of loadNotes) {
        localStorage.setObj(n.order, JSON.stringify({
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

        if (isNaN(obj.order) === false) {
          loadNotes.push({
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
          if (loadNotes[i].order === loadNotes[j].order) {
            loadNotes.splice(j, 1);
          }
        }
      }

      return loadNotes;
    }

    return [];
  }

  add() {
    let order = 1;
    if (this.state.notes) {
      order = this.state.notes.length + 1;
    }

    let newNote = {"order": order, "title": "sample titleX", "text": "sample textX", "left": "25%", "top": "25%", "color": "blue", "time": null};
    let clonedNotes = this.parseNotes();

    clonedNotes.push(newNote);

    clonedNotes = this.localStorage(clonedNotes);

    this.setState({
      notes: clonedNotes
    });
  }

  call(order, callBack) {
    this.setState({active: order});
    callBack();
  }

  dragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    e.preventDefault();
    let order = parseInt(e.dataTransfer.getData("text/plain"));

    let clonedNotes = this.parseNotes();
    for (let i = 0; i < clonedNotes.length; i++) {
      if (clonedNotes[i].order === order) {
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

  order(direction, id) {
    let notes = this.parseNotes();

    if (direction === 1) {
      for (let i = notes.length -1; i >= 0; i--) {
        if (notes[i].order === id) {
          for (let j = 0; j < notes.length; j++) {
            if ((notes[j].order - id) === 1) {
              notes[i].order = notes[j].order;
              notes[j].order = id;
              break;
            }
          }
          break;
        }
      }
    } else {
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].order === id) {
          for (let j = 0; j < notes.length; j++) {
            if ((id - notes[j].order) === 1) {
              notes[i].order = notes[j].order;
              notes[j].order = id;
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
      if (n.order === note.order) {
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
        if (clonedNotes[i].order === id) {
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
    console.log(notes);
    return notes;
  }

  render() {

    let notes = this.parseNotes();
    let renderNotes = [];

    console.log(this.state.notes);

    for (let note of notes) {
      renderNotes.push(<Note changeOrder={this.order} delete={this.delete} colors={this.state.colors}
        order={note.order} title={note.title} call={this.call} onSubmit={this.onSubmit} text={note.text} color={note.color}
        top={note.top} left={note.left} key={1000 * Math.random()} />);
    }

    return (
      <div className="Full" onDrop={e => this.onDrop(e)} onDragOver={e => this.dragOver(e)}>
      <div className="headerRow">
        <button className="add" onClick={this.add}>Add</button>
        <button className="synchronize" onClick={this.add}>Synchronize with database</button>
        <Synchronize API={this.API} SEND={this.SEND} />
      </div>
      <div id="flex">
         {renderNotes}
      </div>
      {this.state.apiResponse}
      </div>);
  }

}

export default Notes;
