/*
* Template for a new note
* @param time unique creation timestamp to identify a new note
* @param order in what order the note is supposed to be rendered
* @color background color
* @joke random template text of note, if API is available. Otherwise we use a standard message.
* @return object Note template
*/
export function noteTemplate(time, order, color, joke) {
  return {
    time: time,
    lastEdited: time,
    order: order,
    title: "sample title",
    text: joke,
    left: Math.floor(Math.random() * 70),
    top: 10 + Math.floor(Math.random() * 50),
    color: color
  }
}
