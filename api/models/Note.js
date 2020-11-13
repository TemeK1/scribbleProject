const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* MongoDB-entity Schema for Note.
*/
const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide title"]
    },
    text: {
        type: String,
        required: [true, "Please provide text"]
    },
    order: {
      type: Number,
      required: true,
      unique: true
    },
    // time created in ms. since 1970
    time: {
      type: Number,
      required: true,
      unique: true
    },
    color: {
        type: String,
        required: [true, "Please provide color code"]
    },
    left: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: true
    },
    lastEdited: {
      type: Number,
      required: true
    }
});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
