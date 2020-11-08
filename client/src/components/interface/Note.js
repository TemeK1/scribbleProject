import React from 'react';
import arrowUp from '../../assets/images/arrowUp.png';
import arrowDown from '../../assets/images/arrowDown.png';
import cancelNote from '../../assets/images/cancelNote.png';
import editNote from '../../assets/images/editNote.png';
import removeNote from '../../assets/images/removeNote.png';

/*
* Component for individual Notes.
*/
class Note extends React.Component {
  constructor(props) {
    super(props);

    let title = JSON.parse(JSON.stringify(this.props.title)),
        text = JSON.parse(JSON.stringify(this.props.text)),
        color = JSON.parse(JSON.stringify(this.props.color));

    this.state = {
      active: false,
      title: title,
      text: text,
      color: color
    }

    this.changeOrder = this.changeOrder.bind(this);
    this.click = this.click.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDragstart = this.onDragStart.bind(this);
    this.setActivity = this.setActivity.bind(this);
  }

  /*
  * To "activate" this Note to receive User Input.
  */
  click() {
    if (!this.state.active) this.setState({active:true});
  }

  /*
  * This is used when a small arrow is clicked to swap the position of this note.
  */
  changeOrder(e, order) {
    e.stopPropagation();
    this.props.changeOrder(order, this.props.order);
  }

  /*
  * To swap between TWO states of this note's visibility.
  * It's either visible or not.
  */
  setActivity() {
    this.setState({active: !this.state.active});
  }

  /*
  * This is used when the trashcan is clicked.
  * To remove note.
  * Calls to callback function of Notes Component.
  */
  delete(e) {
    e.stopPropagation();
    this.props.delete(this.props.order);
  }

  /*
  * To prehandle and prevalidate edits of this specific Note.
  * More decent validation SHOULD occur in API ENDPOINT.
  */
  handleChange(e) {
    let obj = e.target,
        field = obj.name,
        value = obj.value,
        type = obj.type,
        newstate = {};

    // To validate text and title fields.
    if (type === 'text' || obj.id === "text") {
      if (value.trim().length < 3) {
        obj.setCustomValidity("Too short, at least three characters are required");
      } else {
        obj.setCustomValidity("");
      }
      newstate[field] = value;

      this.setState(newstate);
      return;
    }

    this.setState(newstate);
  }

  /*
  * When the form is submitted, we will use
  * callback function onSubmit here. Notes Component
  * will take care of the rest.
  */
  handleSubmit(e) {
    e.preventDefault();
    let note = JSON.parse(JSON.stringify({
      title: this.state.title,
      text: this.state.text,
      time: this.props.time,
      color: this.state.color
    }));
    this.props.onSubmit(note);
    this.setActivity();
  }

  /*
  * To transport an order value of dragged Note via dataTransfer.
  */
  onDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.getAttribute("id"));
  }

  render() {
    let color = [];

    if (this.state.active) {
      // Color options will only be displayed when this note is active.
      for (let c of this.props.colors) {
        let checked = false;
        if (this.state.color === c.color) {
          checked = true;
        }

        color.push(<div className="radioColor" key={c.color} id={c.color} style={{backgroundColor: '#' + c.color}}><input type="radio" name="color" checked={checked} value={c.color} onChange={() => {this.setState({color: c.color})}} /></div>);
      }
    }
    let noteClass = this.state.active ? "Note NoteActive" : "Note";
    let content = this.state.active ?
    // This editable version will be rendered if the note is active
    <div>
    <form className="Edit" onSubmit={this.handleSubmit}>
    <div className="noteOptions">
    <div id="cancel" onClick={() => this.setActivity()}><img src={cancelNote} alt="Cancel" title="Cancel" width="32" height="32" /></div>
    <div id="delete" onClick={e => this.delete(e)}><img src={removeNote} alt="Delete" title="Delete" width="32" height="32" /></div>
    <input type="image" src={editNote} className="Edit" width="32" height="32" alt="Edit" title="Edit"></input>
    </div>
    <input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} style={{backgroundColor: '#' + this.state.color, border: '0px'}}/>
    <textarea rows="5" cols="20" id="text" name="text" value={this.state.text} onChange={this.handleChange} style={{backgroundColor: '#' + this.state.color, border: '0px'}} />
    <div className="colors">{color}</div>
    </form>
    </div>:
    // This non-editable version will be rendered if the note is not active
    <div className="nonActive">
    <div className="Title">{this.props.title}</div><div className="Text">{this.props.text}</div>
    <div className="arrows">
    <div id="arrowUp" onClick={(e) => this.changeOrder(e, 1)}><img src={arrowUp} alt="Arrow up" width="32" height="32"/></div>
    <div id="arrowDown" onClick={(e) => this.changeOrder(e, 0)}><img src={arrowDown} alt="Arrow down" width="32" height="32" /></div>
    </div>
    </div>;

    try {
      return (
        <div id={this.props.time} order={this.props.order} draggable="true" className={noteClass}
        style={{backgroundColor: '#' + this.state.color, top: this.props.top + '%',
        left: this.props.left + '%', order: this.props.order}} onDragStart={this.onDragStart} onClick={this.click}>
            {content}
        </div>);
    } catch(e) {
      return (<div>Error occurred!</div>);
    }
  }
}

export default Note;
