/*
* Template for a new note
* @param id proper id to identify a new note
* @param order in what order the note is supposed to be displayed
* @return object note
*/
export function noteTemplate(time, order, color, joke) {
  return {
    time: time,
    order: order,
    title: "sample titleX",
    text: joke,
    left: Math.floor(Math.random() * 70),
    top: 10 + Math.floor(Math.random() * 50),
    color: color
  }
}
