/*
*
*/
export function calcOrder(direction, order, notes) {

  if (direction === 1) {
    for (let i = notes.length -1; i >= 0; i--) {
      if (notes[i].order === order) {
        for (let j = 0; j < notes.length; j++) {
          if ((notes[j].order - order) === 1) {
            notes[i].order = notes[j].order;
            notes[j].order = order;
            break;
          }
        }
        break;
      }
    }
  } else {
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].order === order) {
        for (let j = 0; j < notes.length; j++) {
          if ((order - notes[j].order) === 1) {
            notes[i].order = notes[j].order;
            notes[j].order = order;
            break;
          }
        }
        break;
      }
    }
  }
  return notes;
}
