const Note = require('../models/Note.js');

module.exports =  async (req,res) => {
  try {
    const note = await Note.deleteOne({
      id: req.params.id
    });
    res.json({ note: note });
  } catch (error) {
    res.json({ status: 'Some error occurred while deleting a note. Maybe try again in a bit?'});
  }
}
