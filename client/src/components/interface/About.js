import React from 'react';
import cancelNote from '../../assets/images/cancelNote.png';

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creator: '-Teemu "TemeKK1" Käpylä',
      text: "Thank you for using Scribble 2000. It is very simple, but yet, powerful application for scribbling notes that add some spice and color on your life.",
      text2: "If you have ideas, suggestions, feedback or whatsoever, feel free to contact me via email. Copyright for pictures belongs to Arjane. Feel free to check her blog.",
      email: 'contact@teemukapyla.fi',
      website: 'https://www.teemukapyla.fi',
      reveal: false,
      graphics: "https://www.arjane.blog"
    }
  }

  about() {
    if (this.state.reveal === false) {
      this.setState({reveal: true});
    } else {
      this.setState({reveal: false});
    }


  }

  render() {

    let content = this.state.reveal ?
    <div className="aboutLayer">
    <p>{this.state.text}</p>
    <p>{this.state.text2}</p>
    <p className="address">{this.state.email}</p>
    <p className="address"><a href={this.state.website} alt="home page" target="_blank">{this.state.website}</a></p>
    <p className="address"><a href={this.state.graphics} alt="home page" target="_blank">{this.state.graphics}</a></p>
    <div className="footer" onClick={() => this.about()}>About Scribble 2000 <img src={cancelNote} alt="Return" title="Return" width="32" height="32" /> </div>
    </div> :

    <div className="footer" onClick={() => this.about()}>About Scribble 2000</div>;

    return <div>{content}</div>;
  }
}

export default About;
