/*
* Calculates a new top- and left position for a dragged note based in innerHeight and innerWidth,
* and updates the correct object of array
* @param notes array of note objects
* @param x x-coordinate of dragged note
* @param y y-coordinate of dragged note
* @param time unique timestamp of a note in question
* @return array of note objects with updated top- and left- attribute
*/
export function calcPosition(notes, x, y, time) {

  for (let i = 0; i < notes.length; i++) {
    if (notes[i].time === time) {
      // When right one is found, we calculate new position based on innerHeight & innerWidth
      let top = (y / window.innerHeight) * 100;
      let left = (x / window.innerWidth) * 100;
      notes[i].top = top;
      notes[i].left = left;
    }
  }
  // Updated array of note objects
  return notes;
}
