const Note = require('../models/Note.js');

module.exports = async (req,res) => {
  try {
    const query = { id: req.params.id  };
    const notes = await Note.findOneAndUpdate(query, {
      order: req.params.order,
      title: req.params.title,
      text: req.params.text,
      left: req.params.left,
      top: req.params.top,
      color: req.params.color } );
    res.json({
        notes: notes
    });
  } catch (error) {
    res.json({ status: 'Some error occurred while editing a note. Maybe try again in a bit?'});
  }
}
