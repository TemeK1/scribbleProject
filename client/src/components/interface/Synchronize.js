import React from 'react';

class Synchronize extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showResult: false,
      queryStatus: "OK"
    }
  }

  render() {
    return this.state.showResult ? <div className="response">{this.state.queryStatus}</div> : <div className="response"></div>;

  }

}

export default Synchronize;
