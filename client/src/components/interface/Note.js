import React from 'react';
import arrowUp from '../../assets/images/arrowUp.png';
import arrowDown from '../../assets/images/arrowDown.png';
import cancelNote from '../../assets/images/cancelNote.png';
import editNote from '../../assets/images/editNote.png';
import removeNote from '../../assets/images/removeNote.png';

class Note extends React.Component {
  constructor(props) {
    super(props);

    let title = JSON.parse(JSON.stringify(this.props.title)),
        text = JSON.parse(JSON.stringify(this.props.text)),
        color = JSON.parse(JSON.stringify(this.props.color)),
        order = JSON.parse(JSON.stringify(this.props.order));

    this.state = {
      active: false,
      order: order,
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

  click() {
    //this.props.call(this.props.id, this.setActivity);
    this.setState({active:true});
  }

  changeOrder(e) {
    this.props.changeOrder(parseInt(e.target.getAttribute('value')), this.props.order);
  }

  setActivity() {

    if (this.state.active === false) {
      this.setState({active:true});
    } else {
      this.setState({active:false});
    }
  }

  delete(e) {
    e.stopPropagation();
    this.props.delete(this.props.order);
  }


  handleChange(e) {
    let obj = e.target;
    let field = obj.name;
    let value = obj.value;
    let type = obj.type;
    let newstate = {};

    if (type === 'radio') {
      newstate["color"] = value;
      this.setState(newstate);
      return;
    }

    if (type === 'text' || obj.id === "text") {
      if (value.trim().length < 2) {
        obj.setCustomValidity("Too short, at least two characters are required");
      } else {
        obj.setCustomValidity("");
      }
      newstate[field] = value;
      this.setState(newstate);
      return;
    }

    this.setState(newstate);
  }

  handleSubmit(e) {
    e.preventDefault();
    let note = JSON.parse(JSON.stringify({title: this.state.title, order: this.state.order, text: this.state.text, color: this.state.color}));
    this.props.onSubmit(note);
  }

  onDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.getAttribute("id"));
  }

  render() {
    let element = [];
    let color = [];

    if (this.state.active) {
      for (let c of this.props.colors) {
        let checked = false;
        if (this.state.color === c.color) {
          checked = true;
        }

        color.push(<span className="radioColor" key={c.color} id={c.color} style={{backgroundColor: c.color}}><input type="radio" name="color" checked={checked} value={c.color} onChange={this.handleChange} /></span>);
      }
    }

    let content = this.state.active ?
    <div>
    <div className="noteOptions">
    <div id="cancel" onClick={() => this.setActivity()}><img src={cancelNote} alt="Cancel" width="32" height="32" /></div>
    <div id="delete" onClick={e => this.delete(e)}><img src={removeNote} alt="Cancel" width="32" height="32" /></div>
    <input type="image" src={editNote} className="Edit" width="32" height="32" alt="Edit"></input>
    </div>
    <input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} style={{backgroundColor: this.state.color, border: '0px'}}/>
    <textarea rows="5" cols="20" id="text" name="text" value={this.state.text} onChange={this.handleChange} style={{backgroundColor: this.state.color, border: '0px'}} />
    <div className="colors">{color}</div>
    </div>:<div><div className="Title">{this.props.title}</div><div className="Text">{this.props.text}</div>
    <div id="arrowUp" onClick={e => this.changeOrder(e)} value="1"><img src={arrowUp} alt="Arrow up" width="32" height="32" /></div>
    <div id="arrowDown"onClick={e => this.changeOrder(e)} value="0"><img src={arrowDown} alt="Arrow down" width="32" height="32" /></div>
    </div>;

    return (
      <div id={this.props.id} draggable="true" className="Note" style={{backgroundColor: this.props.color, top: this.props.top, left: this.props.left, order: this.props.id}}
       onDragStart={this.onDragStart} onClick={this.click}>
      <form className="Edit" onSubmit={this.handleSubmit}>
      {content}
      </form></div>);
  }

}

export default Note;
