/*
* To make sure that all the notes are uploaded (fetch, method: 'POST') to the endpoint.
* One by one.
* We make sure (await) to have all the results before we proceed, just so that logic of the app would stay intact.
* @API url of API to feth messages
* @WRITE extension of API url path for writing/editing
* @notes currently existing local notes
* @prioritizeLocal to indicate whether local or remote more recent edits should be favored.
* @return array of Notes
*/
export async function syncUpload(API, WRITE, notes, prioritizeLocal) {

  try {
    // We care about local more recent edits
    if (prioritizeLocal === 1) {
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
          }),
        };

        if (note.warning === true) {
          // Hence we do not care about mismatch (we prefer local  recent edits), we can already remote so called
          // remote attributes from object. And warning itself as well.
          delete note.titleRemote;
          delete note.textRemote;
          delete note.colorRemote;
          delete note.orderRemote;
          delete note.timeRemote;
          delete note.leftRemote;
          delete note.topRemote;
          delete note.warning;
        }

        // Here we use POST method to transfer one Note to the ENDPOINT, and wait to make sure.
        await fetch(API + WRITE, requestOptions)
          .then(response => response.json());
      }
    } else {
      // Here we chose to prefer remote recent edits so let's store data of those attributes first, per note!
      for (let note of notes) {

        if (note.warning === true) {
          note.title = note.titleRemote;
          note.text = note.textRemote;
          note.color = note.colorRemote;
          note.text = note.textRemote;
          note.left = note.leftRemote;
          note.top = note.topRemote;
          note.order = note.orderRemote;
          delete note.titleRemote;
          delete note.textRemote;
          delete note.colorRemote;
          delete note.orderRemote;
          delete note.timeRemote;
          delete note.leftRemote;
          delete note.topRemote;
          delete note.warning;
        }

        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            time: note.time,
            lastEdited: note.lastEdited - 1,
            left: note.left,
            top: note.top,
            title: note.title,
            text: note.text,
            color: note.color,
            order: note.order
          })
        };
        // Here we use POST method to transfer one Note to the ENDPOINT, and wait to make sure.
        await fetch(API + WRITE, requestOptions)
          .then(response => response.json())
          .then(data => console.log(data));
      }

    }

  } catch (error) {
    console.log(error);
  }

  return notes;
}
