/*
* Calculates a new position of a dragged note based in innerHeight and innerWidth, and updates the right object in the array
* @param clonedNotes currently loaded notes
* @param x x-coordinate of a note
* @param y y-coordinate of a note
* @param id id of a note in question
* @return array currently loaded notes with an update
*/
export function calcPosition(clonedNotes, x, y, order) {

  for (let i = 0; i < clonedNotes.length; i++) {
    if (clonedNotes[i].order === order) {
      let top = (y / window.innerHeight) * 100;
      let left = (x / window.innerWidth) * 100;
      clonedNotes[i].top = top;
      clonedNotes[i].left = left;
    }
  }
  return clonedNotes;
}
