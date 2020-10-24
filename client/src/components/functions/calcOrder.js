/*
*
*/
export function calcOrder(direction, order, notes) {

  if (direction == 1) {
    for (let i = notes.length -1; i > 0; i--) {
      if (notes[i].order === order) {
        notes[i].order = notes[i-1].order;
        notes[i-1].order = order;
        break;
      }
    }
  } else {
    for (let i = 0; i < notes.length -1; i++) {
      if (notes[i].order === order) {
         notes[i].order = notes[i+1].order;
         notes[i+1].order = order;
         break;
      }
    }
  }

  return notes;
}
