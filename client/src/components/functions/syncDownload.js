/*
* Purpose is to fetch all the notes, combine them with existing notes,
* and to set the attribute "warning" and comparison attributes (local & remote) in case mismatches are found between local and remote notes.
* Last edit timestamp in milliseconds difference will tell us if there is a mismatch.
* We make sure (await) to have all the results before we proceed, just so that logic of the app would stay intact.
* @API url of API to feth messages
* @clonedNotes currently existing local notes
* @orderChanged bool if only order of some note was changed
* @coordsChanged bool if only coordinates of some note was changed
* @return array of Notes
*/
export async function syncDownload(API, clonedNotes, orderChanged, coordsChanged) {

  try {
    await fetch(API)
      .then(response => response.json())
      .then(data => data.notes.map(item => {
        if (!clonedNotes.find(function(note) {
            return note.time === item.time;
          })) {

          // But only if the remote item is not flagged for removal
          if (item.isRemoved === false) {
            // Let's push all notes to array in case we do not have them locally yet.
            clonedNotes.push({
              time: item.time,
              lastEdited: item.lastEdited + 1,
              order: item.order,
              top: item.top,
              left: item.left,
              color: item.color,
              title: item.title,
              text: item.text,
              isRemoved: false,
              // We didn't have this Note locally yet, so there is no need to warn anyone.
              warning: false
            });
          }
        } else {
          // Here we have the note locally already
          // Let's find a remote couple for it.
          let note = clonedNotes.find(function(note) {
            return note.time === item.time;
          })

          // But only if the remote item is not flagged for removal
          if (item.isRemoved === false) {
            // If remote note has been edited more recently, we will take some precautions
            let difference = item.lastEdited - note.lastEdited;
            if (item.lastEdited > note.lastEdited) {
              note.titleRemote = item.title;
              note.textRemote = item.text;
              note.colorRemote = item.color;
              note.leftRemote = item.left;
              note.topRemote = item.top;
              note.orderRemote = item.order;
              note.timeRemote = item.time;
              note.lastEdited = item.lastEdited + 1;
              note.difference = difference;
              note.warning = true;
              note.isRemoved = false
            } else {
              // If not, we can remove warning immediately
              note.warning = false;
              note.isRemoved = false;
            }

            if (!orderChanged) {
              note.order = item.order;
            }

            if (!coordsChanged) {
              note.left = item.left;
              note.top = item.top;
            }
          }
        }
      }));

  } catch (error) {
    console.log(error);
  }

  // We remove a note from memory and localStorage, if remote version is flagged for removal.
  for (let i = 0; i < clonedNotes.length; i++) {

    if (typeof clonedNotes[i].isRemoved === 'undefined') {
      await localStorage.removeItem(clonedNotes[i].time);
      clonedNotes.splice(i, 1);
    } else {
      if (clonedNotes[i].isRemoved === false) {
        delete clonedNotes[i].isRemoved;
      }
    }

  }

  return await clonedNotes;
}
