/*
* Swaps the order of two notes.
* @direction 1 == note should go "up", 0 == note should go "down"
* @order order number of transported note
* @notes all notes
* @return array of note objects with updated order attribute
*/
export function calcOrder(direction, order, notes) {

  // If we go "up"
  if (direction === 1) {
    for (let i = notes.length -1; i > 0; i--) {
      if (notes[i].order === order) {
        // When right one is found, we swap positions of it and the previous note
        notes[i].order = notes[i-1].order;
        notes[i-1].order = order;
        break;
      }
    }
    // If we go "down"
  } else {
    for (let i = 0; i < notes.length -1; i++) {
      if (notes[i].order === order) {
         // When right one is found, we swap positions of it and the subsequent note
         notes[i].order = notes[i+1].order;
         notes[i+1].order = order;
         break;
      }
    }
  }
  // Updated array of note objects
  return notes;
}
