import React from 'react';

/*
* To compare two similar Notes, for user to decide if he wants to override mismatching remote notes or not.
* This does nothing else; it exists only for visual aid.
*/

class Comparison extends React.Component {

  render() {
    let textRemote = [] ;

    if (this.props.warning) {
      textRemote.push(<td style={{ backgroundColor: "green"  }}>{this.props.text}</td>);
      textRemote.push(<td style={{ backgroundColor: "red"  }}>{this.props.textRemote}</td>);
      textRemote.push(<td><span style={{ backgroundColor: "green"}}>{this.props.title}</span> => <span style={{ backgroundColor: "red" }}> {this.props.titleRemote}</span></td>);
    } else {
      if (this.props.textRemote) {
        textRemote.push(<td style={{ backgroundColor: "red"  }}>{this.props.text}</td>);
        textRemote.push(<td style={{ backgroundColor: "green"  }}>{this.props.textRemote}</td>);
      } else {
        textRemote.push(<td style={{ backgroundColor: "green"  }}>{this.props.text}</td>);
        textRemote.push(<td style={{ backgroundColor: "red"  }}>{this.props.textRemote}</td>);
      }

      textRemote.push(<td><span style={{ backgroundColor: "green"}}>{this.props.title}</span> => <span style={{ backgroundColor: "green" }}> {this.props.titleRemote}</span></td>);
    }

    return (
      <React.Fragment>
      <tr>
      {textRemote[0]}
      {textRemote[1]}
      {textRemote[2]}
      <td>{this.props.time}</td>
      </tr>
      </React.Fragment>);
  }
}

export default Comparison;
