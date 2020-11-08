import React from 'react';
import arrowUp from '../../assets/images/arrowUp.png';
import arrowDown from '../../assets/images/arrowDown.png';
import cancelNote from '../../assets/images/cancelNote.png';
import editNote from '../../assets/images/editNote.png';
import removeNote from '../../assets/images/removeNote.png';

import { styles } from '../../assets/style/styles.js';

import {
  Image,
  Text,
  TextInput,
  View
} from 'react-native';

/*
* Component for individual Notes.
*/
class Note extends React.Component {
  constructor(props) {
    super(props);

    let title = JSON.parse(JSON.stringify(this.props.title)),
        text = JSON.parse(JSON.stringify(this.props.text)),
        color = JSON.parse(JSON.stringify(this.props.color)),
        order = JSON.parse(JSON.stringify(this.props.order)),
        time = JSON.parse(JSON.stringify(this.props.time));

    this.state = {
      active: false,
      time: time,
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
  changeOrder(e) {
    e.stopPropagation();
    this.props.changeOrder(parseInt(e.target.getAttribute('value')), this.props.order);
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
  * More decent validation will occur in API ENDPOINT.
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
    let note = JSON.parse(JSON.stringify({title: this.state.title, order: this.state.order, time: this.state.time, text: this.state.text, color: this.state.color}));
    this.props.onSubmit(note);
    this.setActivity();
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
//<RButton selected={checked} color={c.color} />
        color.push(<Pressable key={10000 * Math.random()} onPress={() => { this.setState({color: c.color})} }></Pressable>);
      }
    }
    let noteClass = this.state.active ? "Note NoteActive" : "Note";
    let content = this.state.active ?
    // This editable version will be rendered if the note is active
    <View>
    <View>
    <View id="cancel" onPress={() => this.setActivity()}><Image source={cancelNote} style={styles.cancel} /></View>
    <View id="delete" onPress={e => this.delete(e)}><Image source={removeNote} style={styles.remove} /></View>
    <Image source={editNote} style={styles.edit}></Image>
    </View>
    <TextInput name="title" value={this.state.title}/>
    <TextInput multiline={true} numberOfLines={1} name="text" value={this.state.text}/>
    <View>{color}</View>
    </View>:
    // This non-editable version will be rendered if the note is not active
    <View>
    <View style={styles.title}><Text>{this.props.title}</Text></View><View style={styles.text}><Text>{this.props.text}</Text></View>
    <View style={styles.arrows}>
    <View onPress={e => this.changeOrder(e)}><Image source={arrowUp} style={styles.arrow} value="1"/></View>
    <View onPress={e => this.changeOrder(e)}><Image source={arrowDown} styles={styles.arrow} value="0" /></View>
    </View>
    </View>;
    //      {content}
    try {
      return (
        <View id={this.props.time} order={this.props.order} style={{backgroundColor: '#' + this.state.color, order: this.props.order}}
         onPress={this.click}>
        {content}
        </View>);
    } catch(e) {
        return (<View><Text>Error occurred!</Text></View>);
    }
  }
}

export default Note;
