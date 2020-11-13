/*
* Here we just push notes from Realm database (notes) to an array (currentNotes).
* @notes array of Realm notes
* @return array of notes
*/
export function handleNotes(notes) {
  let currentNotes = [];

  for (let i = 0; i < notes.length; i++) {
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
  return currentNotes;
}
