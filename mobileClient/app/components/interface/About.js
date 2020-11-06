import React from 'react';
import cancelNote from '../../assets/images/cancelNote.png';

/*
* Just a simple Component for rendering about
* details of the App for the end user to see.
*/

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creator: '-Teemu "TemeKK1" Käpylä',
      text: "Thank you for using Scribble 2000. It is very simple, but yet, powerful application for scribbling notes that add some spice and color on your life.",
      text2: "If you have ideas, suggestions, feedback or whatsoever, feel free to contact me via email. Copyright for pictures belongs to Arjane. Feel free to check her blog.",
      email: 'contact@teemukapyla.dev',
      website: 'https://www.teemukapyla.fi',
      reveal: false,
      graphics: "https://www.arjane.blog"
    }
  }

  /*
  * SWAP for this.state.reveal which
  * indicates IF the  content IS VISIBLE OR NOT.
  */
  about() {
    if (this.state.reveal === false) {
      this.setState({reveal: true});
    } else {
      this.setState({reveal: false});
    }

  }

  render() {

    // We render this if the content is visible.
    let content = this.state.reveal ?
    <div className="aboutLayer">
    <p>{this.state.text}</p>
    <p>{this.state.text2}</p>
    <p className="address">{this.state.email}</p>
    <p className="address"><a href={this.state.website} alt="home page" target="_blank" rel="noopener noreferrer">{this.state.website}</a></p>
    <p className="address"><a href={this.state.graphics} alt="home page" target="_blank" rel="noopener noreferrer">{this.state.graphics}</a></p>
    <div className="footer" onClick={() => this.about()}>About Scribble 2000 <img src={cancelNote} alt="Return" title="Return" width="32" height="32" /> </div>
    </div> :
    // And this if the content is not visible.
    <div className="footer" onClick={() => this.about()}>About Scribble 2000</div>;

    return <div>{content}</div>;
  }
}

export default About;
