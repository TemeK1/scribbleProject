/*
* Parsing all the notes for further use.
*/
export function parseNotes(stateNotes) {
  let notes = [];
  for (let note of stateNotes) {
    notes.push(JSON.parse(JSON.stringify(note)));
  }

  notes.sort(function(a, b) {
    if (a.order < b.order) return 1;
    if (a.order > b.order) return -1;
    return 0;
  });
  return notes;
}
