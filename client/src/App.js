import React from 'react';
import Notes from './components/interface/Notes.js';
import About from './components/interface/About.js';
import './assets/style/style.css';

/*
* TIES504 Erikoistyö.
* Notes Browser App "Scribble 2000". App.js renders two main components: Notes & About.
*/
class App extends React.Component {

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
