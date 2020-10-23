/*
* Template for a new note
* @param id proper id to identify a new note
* @param order in what order the note is supposed to be displayed
* @return object note
*/
export function noteTemplate(id, order) {
  return {"id": id, "order": order, "title": "sample titleX", "text": "sample textX", "left": "25%", "top": "25%", "color": "#AFD5AA", "time": new Date()};
}
