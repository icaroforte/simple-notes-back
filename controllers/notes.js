const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
    response.json(notes);
})

notesRouter.get('/:id', async (request, response) => {
    await Note.findById(request.params.id).then(note => {
        response.json(note);
    });
})

notesRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findById(body.userId);

    if (!body.content) {
        console.log('error: "content missing"');
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = new Note({
        content: body.content,
        subContent: body.subContent,
        user: user.id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.json(savedNote);
})

notesRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const note = {
        content: body.content,
        subContent: body.subContent
    };

    await Note.findByIdAndUpdate(request.params.id, note, { new: true }).then(noteUpdated => {
        response.json(noteUpdated);
    });
})

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndDelete(request.params.id).then(note => {
        response.status(204).end();
    });
})

module.exports = notesRouter;