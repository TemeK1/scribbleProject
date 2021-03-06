const Note = require('../models/Note.js');

/*
* Controller for fetching all the notes from the database in JSON format.
*/
module.exports = async (req,res) => {
  try {
    const notes = await Note.find({}).sort([['order', 1]]);//{$or: [{title: new RegExp(req.body.search, 'i')}, {body: new RegExp(req.body.search, 'i')}]});
    res.json({
        notes: notes
    });
  } catch (error) {
    res.json({ status: 'Some error occurred. Maybe try again in a bit?'});
  }
}
