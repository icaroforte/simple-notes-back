require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note');

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('--------------', request.body);
    next();
};

const unknowEndPoint = (request, response) => {
    response.status(404).send({ error: 'rota desconhecida' });
};

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
})

app.post('/api/notes', (request, response) => {
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
    });
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        subContent: body.subContent
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true }).then(noteUpdated => {
        response.json(noteUpdated);
    }).catch(error => next(error));
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id).then(note => {
        response.status(204).end();
    }).catch(error => next(error));
})

app.use(unknowEndPoint);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);