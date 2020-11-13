
const Note = require('../models/Note.js');

/*
* Controller for deleting a chosen note (based on unique TIME) permanently from the database.
*/
module.exports =  async (req,res) => {
  try {
    const note = await Note.deleteOne({
      time: req.params.time
    });
    res.json({ note: note });
  } catch (error) {
    res.json({ status: 'Some error occurred while deleting a note. Maybe try again in a bit?'});
  }
}
