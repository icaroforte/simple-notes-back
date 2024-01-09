const express = require('express');
const app = express();
const cors = require('cors');

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('--------------', request.body);
    next();
}

const unknowEndPoint = (request, response) => {
    response.status(404).send({ error: 'rota desconhecida' });
}

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);

let notes = [
    {
        "id": 1,
        "content": "HTML é fácil",
        "subContent": "Mas nem tão fácil assim"
    },
    {
        "id": 2,
        "content": "O navegador só pode executar JavaScript",
        "subContent": "Mas se o render for server side não precisa de JS no front"
    },
    {
        "id": 3,
        "content": "GET e POST são os métodos mais importantes do protocolo HTTP",
        "subContent": "Mas existem outros como PATH, DELETE, FETCH"
    },
    {
        "content": "Testando adicionar nota ao server",
        "subContent": "",
        "id": 4
    },
    {
        "content": "Testando",
        "subContent": "",
        "id": 5
    },
    {
        "content": "Nota 123",
        "subContent": "AJSDAJ",
        "id": 6
    },
    {
        "content": "Nova nota",
        "subContent": "Exemplo",
        "id": 7
    },
    {
        "content": "Teste",
        "subContent": "Exemplo 1",
        "id": 10
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!<h1/>');
})

app.get('/api/notes', (request, response) => {
    response.json(notes);
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    note ? response.json(note) : response.status(400).send('Nota não encontrada').end();
})

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        console.log('error: "content missing"');
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        content: body.content,
        subContent: body.subContent,
        id: generateId()
    };

    notes = notes.concat(note);

    console.log(note);
    response.json(note);
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const body = request.body;
    const noteToUpdated = notes.find(n => n.id === id);
    const noteWithNewProperties = {
        ...noteToUpdated,
        content: body.content,
        subContent: body.subContent 
    };

    notes = notes.map(note => 
        note.id === id ? noteWithNewProperties : note
    );

    response.json(noteWithNewProperties);
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
};

app.use(unknowEndPoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);