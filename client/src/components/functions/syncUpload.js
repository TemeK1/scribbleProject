/*
 * To make sure that all the notes are uploaded (fetch, method: 'POST') to the endpoint.
 * One by one.
 */
export function syncUpload(API, WRITE, notes) {
  try {
    let editTime = new Date().getTime();
    for (let note of notes) {
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
  } catch (error) {
    console.log(error);
  }
}
