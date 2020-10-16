const Note = require('../models/Note.js');

module.exports = async (req,res) => {
    const notes = await Note.find({});//{$or: [{title: new RegExp(req.body.search, 'i')}, {body: new RegExp(req.body.search, 'i')}]});
    res.json({
        notes: notes
    });
}
