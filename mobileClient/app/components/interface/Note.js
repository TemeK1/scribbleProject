import React from 'react';

// Import Images
import arrowUp from '../../assets/images/arrowUp.png';
import arrowDown from '../../assets/images/arrowDown.png';
import cancelNote from '../../assets/images/cancelNote.png';
import editNote from '../../assets/images/editNote.png';
import removeNote from '../../assets/images/removeNote.png';

// Import CSS
import { styles } from '../../assets/style/styles.js';

// Import custom Radio button
import { RadioButton } from './RadioButton.js';

// Import necessary React Native Components
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


// Import npm package for swipe gestures
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
    this.removeNote = this.removeNote.bind(this);
    this.setActivity = this.setActivity.bind(this);
    this.swipeColor = this.swipeColor.bind(this);
  }

  /*
  * To "activate" this Note to receive User Input.
  */
  click() {
    if (!this.state.active) this.setState({ active:true, title: this.props.title, text: this.props.text, color: this.props.color });
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
    this.props.delete(this.props.time);
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
  */
  swipeColor() {
    let random = Math.floor(Math.random() * this.props.colors.length);
    let color = JSON.parse(JSON.stringify(this.props.colors[random].color));
    this.setState({ color: color });
    this.props.onSubmit({ color: color, time: this.props.time, text: this.state.text, title: this.state.title});
  }

  /*
  * Handler for alternative Swipes.
  * LEFT (remove) or RIGHT (change random color)
  */
  onSwipe(gestureName, gestureState) {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_LEFT:
        this.removeNote();
        break;
      case SWIPE_RIGHT:
        this.swipeColor();
        break;
    }
  }

  /*
  * This is prompted from the enduser
  */
  removeNote = () =>
    Alert.alert(
      "Remove the note?",
      "",
      [
        {
          text: "Cancel"
        },
        { text: "OK",
          onPress: () => this.props.delete(this.props.time)}
      ],
  );

  render() {
    // Configuration for SWIPE
    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 100,
      gestureIsClickThreshold: 5,
    };

    let color = [];

    if (this.state.active) {
      // Color options will only be displayed when this note is active.
      for (let c of this.props.colors) {
        let checked = false;
        if (this.state.color === c.color) {
          checked = true;
        }

        color.push(<Pressable key={10000 * Math.random()} onPress={() => { this.setState({ color: c.color })} }><RadioButton selected={checked} color={c.color} /></Pressable>);
      }
    }

    let content = this.state.active ?
    // This editable version will be rendered if the note is active
    <View>
      <View style={styles.buttons}>
        <View id="cancel"><TouchableOpacity onPress={() => this.setActivity()}><Image source={cancelNote} style={styles.cancel} /></TouchableOpacity></View>
        <View id="delete"><TouchableOpacity onPress={(e) => this.delete(e)}><Image source={removeNote} style={styles.remove} /></TouchableOpacity></View>
        <View id="edit"><TouchableOpacity onPress={(e) => this.handleSubmit(e) }><Image source={editNote} style={styles.edit}></Image></TouchableOpacity></View>
      </View>
      <View><TextInput name="title" style={styles.title} value={this.state.title} onChangeText={(title) => this.handleTitle(title)}/></View>
      <View><TextInput multiline={true} style={styles.text} numberOfLines={1} name="text" value={this.state.text} onChangeText={(text) => this.handleText(text)}/></View>
      <View style={{flexGrow: 1, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: '5%' }}>
        {color}
      </View>
    </View>:
    // This non-editable version will be rendered if the note is not active
    <View>
      <View><Text style={styles.title}>{this.props.order}</Text></View><View><Text style={styles.text}>{this.props.text}</Text></View>
      <View style={styles.arrows}>
        <View><Pressable onPress={() => this.changeOrder(1)}><Image source={arrowUp} style={styles.arrow} /></Pressable></View>
        <View><Pressable onPress={() => this.changeOrder(0)}><Image source={arrowDown} style={styles.arrow} /></Pressable></View>
      </View>
    </View>;

    try {
      return (
        <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        config={config}
        style={{ backgroundColor: '#' + this.props.color, marginBottom: 2, minHeight: 85}}>
          <Pressable onPress={() => this.click()}>
            {content}
          </Pressable>
        </GestureRecognizer>);
    } catch(e) {
        return (<View><Text>Error occurred!</Text></View>);
    }
  }
}

export default Note;
