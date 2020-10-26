const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
      required: true
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
      type: Date,
      default: new Date()
    }
});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
