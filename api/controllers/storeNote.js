const Note = require('../models/Note.js');

module.exports =  async (req,res) => {

  try {
    const query = { time: req.body.time  },
          update = {
            ...req.body,
          },
          options = { upsert: true };
    const notes = await Note.findOneAndUpdate(query, update, options);
    res.json({
        notes: notes
    });
  } catch (error) {
    res.json({ status: error });
  }
}

//'Some error occurred while handling the query. Maybe try again in a bit?'
