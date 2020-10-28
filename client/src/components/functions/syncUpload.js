/*
 * To make sure that all the notes are uploaded (fetch, method: 'POST') to the endpoint.
 * One by one.
 */
export function syncUpload(API, WRITE, notes, prioritizeLocal) {
  try {

    let editTime = new Date().getTime();

    if (prioritizeLocal) {
      for (let note of notes) {

        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            time: note.time,
            lastEdited: note.lastEdited,
            left: note.left,
            top: note.top,
            title: note.title,
            text: note.text,
            color: note.color,
            order: note.order
          })
        };

        if (note.warning === true) {
          delete note.titleRemote;
          delete note.textRemote;
          delete note.colorRemote;
          delete note.orderRemote;
          delete note.lastEditedRemote;
          delete note.timeRemote;
          delete note.leftRemote;
          delete note.topRemote;
          delete note.warning;
        }

        fetch(API + WRITE, requestOptions)
          .then(response => response.json())
          .then(data => console.log(data));
      }
    } else {
      for (let note of notes) {
        if (note.warning === true) {
          note.lastEdited = note.lastEditedRemote;
          delete note.titleRemote;
          delete note.textRemote;
          delete note.colorRemote;
          delete note.orderRemote;
          delete note.lastEditedRemote;
          delete note.timeRemote;
          delete note.leftRemote;
          delete note.topRemote;
          delete note.warning;
          continue;
        }

        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            time: note.time,
            lastEdited: editTime,
            left: note.left,
            top: note.top,
            title: note.title,
            text: note.text,
            color: note.color,
            order: note.order
          })
        };

        fetch(API + WRITE, requestOptions)
          .then(response => response.json())
          .then(data => console.log(data));
      }

    }

  } catch (error) {
    console.log(error);
  }

  return notes;
}
