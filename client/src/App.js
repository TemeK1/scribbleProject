import React from 'react';
import Notes from './components/interface/Notes.js';
import './assets/style/style.css';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = { apiResponse: "" };
  }

 render() {
   return (
     <div className="App">
       <header className="App-header">
       </header>
       <Notes />
     </div>
   );
 }
}

export default App;
