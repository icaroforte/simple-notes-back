const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
    await Note.find({}).then(notes => {
        response.json(notes);
    })
})

notesRouter.get('/:id', async (request, response) => {
    await Note.findById(request.params.id).then(note => {
        response.json(note);
    });
})

notesRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!body.content) {
        console.log('error: "content missing"');
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = new Note({
        content: body.content,
        subContent: body.subContent
    });

    await note.save().then(savedNote => {
        response.json(savedNote);
    });
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