/*
* This function sets new notes on localStorage, and also fetches old notes from it.
* @param notes currently loaded notes
* @return array containing all notes (also ones from localStorage)
*/
export function handleLocalStorage(notes) {
  // How to get object from localStorage
  Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
  }

  // How to set object to localStorage
  Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key,(obj));
  }

  // First we set all Note objects to localStorage
  // Unique Timestamp of Note creation functions as a key,
  // No duplicates will occur.
  for (let n of notes) {
    localStorage.setObj(n.time, JSON.stringify({
        time: n.time,
        lastEdited: n.lastEdited,
        order: n.order,
        title: n.title,
        text: n.text,
        left: n.left,
        top: n.top,
        color: n.color
      }));
  }

  // We get all the Note data from localStorage.
  for (let i = 0; i < localStorage.length; i++) {
    let obj = localStorage.getObj(localStorage.key(i));
    // Only if time attribute IS a number
    if (isNaN(obj.time) === false) {
        notes.push({
          time: obj.time,
          lastEdited: obj.lastEdited,
          order: obj.order,
          title: obj.title,
          text: obj.text,
          left: obj.left,
          top: obj.top,
          color: obj.color
        });
    }
  }

  // Well, could probably do this better but this is my way of
  // making sure that there ain't no duplicates in localStorage and volatile browser memory
  for (let i = 0; i < notes.length; i++) {
    for (let j = notes.length -1; j > i; j--) {
      if (notes[i].time === notes[j].time) {
        notes.splice(j, 1);
      }
    }
  }

  // Array of Note objects
  return notes;

}
