import React from 'react';
import Notes from './components/interface/Notes.js';
import About from './components/interface/About.js';
import './assets/style/style.css';

class App extends React.Component {
  constructor(props) {
      super(props);
  }

 render() {
   return (
     <div className="App">
       <Notes />
       <About />
     </div>
   );
 }
}

export default App;
