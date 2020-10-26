/*
* Sorting all notes based on their order attribute
* @notes array of Note objects
* @return array of Note objects in descending order.
*/
export function sortNotes(notes) {

  notes.sort(function(a, b) {
    if (a.order < b.order) return 1;
    if (a.order > b.order) return -1;
    return 0;
  });
  return notes;
}
