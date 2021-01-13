const Note = require('../models/Note.js');

/*
* Controller for deleting a chosen note (based on unique TIME) from the database. We actually do not remove it,
* we set a flag indicating that user should not see it in the clientside
*/
module.exports =  async (req,res) => {
  try {

    const note = await Note.findOneAndUpdate({ time: req.body.time }, { ...req.body, isRemoved: true }, { upsert: false });

    res.json({
        note: note
    });

  } catch (error) {
    res.json({ status: "There was error in the deleting process. Please try again in a bit."});
  }
}
