import React from 'react';

/*
* To compare two similar Notes, for user to decide if he wants to override mismatching remote notes or not.
* This does nothing else; just for visual aid.
*/
class Comparison extends React.Component {

  render() {
    let textRemote = [] ;

    // If there is a mismatch,
    // we highlight the remote note with red backgroundColor
    if (this.props.warning) {
      textRemote.push(<td style={{ backgroundColor: "green" }}>{this.props.text}</td>);
      textRemote.push(<td style={{ backgroundColor: "red" }}>{this.props.textRemote}</td>);
      textRemote.push(<td><span style={{ backgroundColor: "green" }}>{this.props.title}</span> => <span style={{ backgroundColor: "red" }}> {this.props.titleRemote}</span></td>);
    }

    return (
      <React.Fragment>
      <tr>
      {textRemote}
      <td>{this.props.time}</td>
      </tr>
      </React.Fragment>);
  }
}

export default Comparison;
