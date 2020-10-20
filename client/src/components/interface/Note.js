import React from 'react';

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
      element.push(<input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange}/>);
      element.push(<textarea rows="10" cols="20" id="text" name="text" value={this.state.text} onChange={this.handleChange} />);
      if (this.props.color === "#FF0000") {
        element.push(<div id="delete" style={{color: "black"}} onClick={e => this.delete(e)}>X</div>);
      } else {
        element.push(<div id="delete" style={{color: "red"}} onClick={e => this.delete(e)}>X</div>);
      }
      element.push(<button className="Save">Save</button>);
      for (let c of this.props.colors) {
        let checked = false;
        if (this.state.color === c.color) {
          checked = true;
        }

        color.push(<td key={c.color} style={{backgroundColor: c.color}}>
         <input type="radio" name="color" id={c.color} checked={checked} value={c.color} onChange={this.handleChange} /></td>);
      }


    } else {
      element.push(<React.Fragment>{this.props.title}</React.Fragment>);
      element.push(<React.Fragment>{this.props.text}</React.Fragment>);
      element.push(<div id="arrowUp" onClick={e => this.changeOrder(e)} value="1">Up</div>);
      element.push(<div id="arrowDown"onClick={e => this.changeOrder(e)} value="0">Down</div>);
    }



    return (
      <div id={this.props.id} draggable="true" className="Note" style={{backgroundColor: this.props.color, top: this.props.top, left: this.props.left, order: this.props.id}}
       onDragStart={this.onDragStart} onClick={this.click}>
      <form className="Edit" onSubmit={this.handleSubmit}>
      {element[2]} {element[4]} {element[5]}
      <div className="Title">{element[0]}</div><div className="Text">{element[1]}</div>
      <table id="colors"><tbody><tr>{color}</tr></tbody></table>
      {element[3]}
      </form></div>);
  }

}

export default Note;
