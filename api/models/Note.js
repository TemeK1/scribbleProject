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
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    id: {
      type: Number,
      required: true
    },
    color: {
        type: String,
        required: [true, "Please provide color code"]
    },
    left: {
      type: String,
      required: true
    },
    top: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      default: new Date()
    },

});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
