import React from 'react';
import arrowUp from '../../assets/images/arrowUp.png';
import arrowDown from '../../assets/images/arrowDown.png';
import cancelNote from '../../assets/images/cancelNote.png';
import editNote from '../../assets/images/editNote.png';
import removeNote from '../../assets/images/removeNote.png';

import { styles } from '../../assets/style/styles.js';

import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    this.handleTitle = this.handleTitle.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setActivity = this.setActivity.bind(this);
    this.swipeColor = this.swipeColor.bind(this);
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
  changeOrder(order) {
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
  * To prevalidate title of this note.
  * More decent validation SHOULD occur in API ENDPOINT.
  */
  handleTitle(title) {
    // To validate title-field
    if (title.trim().length > 60) {
      return;
    } else {
      this.setState({ title: title });
    }
  }

  /*
  * To prevalidate text of this note.
  * More decent validation SHOULD occur in API ENDPOINT.
  */
  handleText(text) {
    // To validate title-field
    if (text.trim().length > 3000) {
      return;
    } else {
      this.setState({ text: text });
    }
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
  * Swipe to fetch a random color.
  * Swiping itself still to be implemented.
  */
  swipeColor() {
    let random = Math.floor(Math.random() * this.props.colors.length);
    let color = JSON.parse(JSON.stringify(this.props.colors[random].color));
    this.setState({ color: color });
    this.props.onSubmit({ color: color, time: this.props.time, text: this.state.text, title: this.state.title});
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

        color.push(<Pressable key={10000 * Math.random()} onPress={() => { this.setState({ color: c.color })} }><Text>x</Text></Pressable>);
      }
    }

    let content = this.state.active ?
    // This editable version will be rendered if the note is active
    <View>
      <View id="cancel"><TouchableOpacity onPress={() => this.setActivity()}><Image source={cancelNote} style={styles.cancel} /></TouchableOpacity></View>
      <View id="delete"><TouchableOpacity onPress={(e) => this.delete(e)}><Image source={removeNote} style={styles.remove} /></TouchableOpacity></View>
      <View id="edit"><TouchableOpacity onPress={(e) => this.handleSubmit(e) }><Image source={editNote} style={styles.edit}></Image></TouchableOpacity></View>
      <View><TextInput name="title" value={this.state.title} onChangeText={(title) => this.handleTitle(title)}/></View>
      <View><TextInput multiline={true} numberOfLines={1} name="text" value={this.state.text} onChangeText={(text) => this.handleText(text)}/></View>
      <View style={{flexGrow: 1, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: '5%' }}>
        {color}
      </View>
    </View>:
    // This non-editable version will be rendered if the note is not active
    <View>
      <View><Text style={styles.title}>{this.props.title}</Text></View><View><Text style={styles.text}>{this.props.text}</Text></View>
      <View style={styles.arrows}>
        <View><Pressable onPress={() => this.changeOrder(1)}><Image source={arrowUp} style={styles.arrow} /></Pressable></View>
        <View><Pressable onPress={() => this.changeOrder(0)}><Image source={arrowDown} style={styles.arrow} /></Pressable></View>
      </View>
    </View>;

    try {
      return (
        <View id={this.props.time} order={this.props.order} style={{
          flexGrow: 1, flexDirection: 'column', backgroundColor: '#' + this.state.color, marginBottom: '1%', order: this.props.order }}>
          <Pressable onPress={() => this.click()}>
            {content}
          </Pressable>
        </View>);
    } catch(e) {
        return (<View><Text>Error occurred!</Text></View>);
    }
  }
}

export default Note;
