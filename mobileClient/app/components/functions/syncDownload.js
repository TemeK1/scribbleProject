/*
* Purpose is to fetch all the notes, combine them with existing notes,
* and to set the attribute "warning" and comparison attributes (local & remote) in case mismatches are found between local and remote notes.
* Last edit timestamp in milliseconds difference will tell us if there is a mismatch.
* We make sure (await) to have all the results before we proceed, just so that logic of the app would stay intact.
* @API url of API to feth messages
* @clonedNotes currently existing local notes
*/
export async function syncDownload(API, clonedNotes) {
  try {
    let maximumOrder = 1;
    // Helps to make sure we won't have duplicate order numbers
    for (let note of clonedNotes) {
      note.order = maximumOrder;
      maximumOrder++;
    }

    await fetch(API)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        if (!clonedNotes.find(function(note) {
            return note.time === item.time
          })) {

          // Let's push all the notes to array that we do not have locally yet.
          clonedNotes.push({
            time: item.time,
            lastEdited: item.lastEdited,
            order: maximumOrder,
            top: item.top,
            left: item.left,
            color: item.color,
            title: item.title,
            text: item.text,
            // We didn't have this Note locally yet, so there is no need to warn anyone.
            warning: false
          });

        } else {

          let note = clonedNotes.find(function(note) {
            return note.time === item.time
          })

          // If remote note has been edited more recently
          if (item.lastEdited > note.lastEdited) {
            note.titleRemote = item.title;
            note.textRemote = item.text;
            note.colorRemote = item.color;
            note.leftRemote = item.left;
            note.topRemote = item.top;
            note.orderRemote = maximumOrder;
            note.timeRemote = item.time;
            note.lastEditedRemote = item.lastEdited;
            note.warning = true;
          } else {
            // If not, we can remote the warning immediately
            note.warning = false;
            note.order = maximumOrder;
          }
        }
        maximumOrder++
      }));

  } catch (error) {
    console.log(error);
  }
  console.log(clonedNotes);
  return clonedNotes;
}
