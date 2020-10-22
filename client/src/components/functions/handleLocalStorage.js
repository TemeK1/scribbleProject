/*
* This function sets new notes on localStorage, and also fetches old notes from it.
* @param loadNotes currently loaded notes
* @return arraay containing already loaded notes and notes from localStorage
*/
export function handleLocalStorage(loadNotes) {
  Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
  }

  Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key,(obj));
  }

  if (loadNotes) {
    for (let n of loadNotes) {
      localStorage.setObj(n.id, JSON.stringify({
        "id": n.id,
        "order": n.order,
        "title": n.title,
        "text": n.text,
        "left": n.left,
        "top": n.top,
        "color": n.color,
        "time": n.time}));
    }

    for (let i = 0; i < localStorage.length; i++) {
      let obj = localStorage.getObj(localStorage.key(i));

      if (isNaN(obj.id) === false) {
        loadNotes.push({
          "id":obj.id,
          "order": obj.order,
          "title": obj.title,
          "text": obj.text,
          "left": obj.left,
          "top": obj.top,
          "color": obj.color,
          "time": obj.time
        });
      }
    }

    for (let i = 0; i < loadNotes.length; i++) {
      for (let j = loadNotes.length -1; j > i; j--) {
        if (loadNotes[i].id === loadNotes[j].id) {
          loadNotes.splice(j, 1);
        }
      }
    }

    return loadNotes;
  }

  return [];
}
