/*
* @notes array of local notes
* @return array of notes
*/
export async function handleNotes(notes) {
  let currentNotes = [];

  for (let i = 0; i < notes.length; i++) {
    let addNew = true;
    for (let n of currentNotes) {
      if (notes[i].time == n.time) {
        addNew = false;
      }
    }
    
    if (addNew === true) {
      let note = {
        time: notes[i].time,
        lastEdited: notes[i].lastEdited,
        order: notes[i].order,
        title: notes[i].title,
        text: notes[i].text,
        color: notes[i].color,
        left: notes[i].left,
        top: notes[i].top
      };
      currentNotes.push(note);
    }
  }
  return currentNotes;
}
