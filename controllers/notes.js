const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
})

notesRouter.get('/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
})

notesRouter.post('/', (request, response, next) => {
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

    note.save().then(savedNote => {
        response.json(savedNote);
    }).catch(error => next(error));
})

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        subContent: body.subContent
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true }).then(noteUpdated => {
        response.json(noteUpdated);
    }).catch(error => next(error));
})

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id).then(note => {
        response.status(204).end();
    }).catch(error => next(error));
})

module.exports = notesRouter;