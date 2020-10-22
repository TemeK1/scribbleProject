/*
* Template for a new note
* @param id proper id to identify a new note
*/
export function noteTemplate(id) {
  return {"id": id, "order": id, "title": "sample titleX", "text": "sample textX", "left": "25%", "top": "25%", "color": "#AFD5AA", "time": new Date()};
}
