const Note = require('../models/Note.js');

module.exports =  async (req,res) => {
  const note = await Note.create({
            id: req.params.id,
            order: req.params.order,
            title: req.params.title,
            text: req.params.text,
            left: req.params.left,
            top: req.params.top,
            color: req.params.color
        })
 res.json({ note: note });
}
