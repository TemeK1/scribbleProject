const Note = require('../models/Note.js');

/*
* Controller for fetching one chosen note (mainly to check it's removal status) from the database in JSON format.
*/
module.exports = async (req,res) => {
  try {
    const note = await Note.findOne({ time: req.params.time }).exec();
    res.json({
        isRemoved: note.isRemoved
    });
  } catch (error) {
    res.json({ status: 'Some error occurred. Maybe try again in a bit?'});
  }
}
