/*
*
*/
export function syncDownload(API, clonedNotes) {
  try {
    let maximumOrder = 1;

    fetch(API)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        if (!clonedNotes.find(function(note) {
            return note.time === item.time
          })) {

          clonedNotes.push({
            time: item.time,
            lastEdited: item.lastEdited,
            order: maximumOrder,
            top: item.top,
            left: item.left,
            color: item.color,
            title: item.title,
            text: item.text,
            // We didn't have this Note locally yet, so no need to warn anyone.
            warning: false
          });

        } else {

          let note = clonedNotes.find(function(note) {
            return note.time === item.time
          })

          if (item.lastEdited > note.lastEdited) {
            note.titleRemote = item.title;
            note.textRemote = item.text;
            note.colorRemote = item.color;
            note.leftRemote = item.left;
            note.topRemote = item.top;
            note.orderRemote = maximumOrder;
            note.timeRemote = item.time;
            note.lastEditedRemote = item.lastEdited;
            // Note was edited remotely more recently than locally
            note.warning = true;
          }
        }
        maximumOrder++
      }));


  } catch (error) {
    console.log(error);
  }

  return clonedNotes;
}
