import React from 'react';

/*
* To compare two similar Notes, for user to decide if he wants to override mismatching remote notes or not.
* This does nothing else; just for visual aid.
*/
class Comparison extends React.Component {

  render() {

    // If there is a mismatch,
    // we highlight the remote note with red backgroundColor

    return (
      <React.Fragment>
      <tr>
      <td style={{ backgroundColor: '#' + this.props.color }}>{this.props.text}</td>
      <td style={{ backgroundColor: '#' + this.props.colorRemote }}>{this.props.textRemote}</td>
      <td><span style={{ backgroundColor: '#' + this.props.color }}>{this.props.title}</span> => <span style={{ backgroundColor: '#' + this.props.colorRemote }}> {this.props.titleRemote}</span></td>
      </tr>
      </React.Fragment>);
  }
}

export default Comparison;
