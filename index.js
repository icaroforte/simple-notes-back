require('dotenv').config(); // importante carregar antes para garantir que as propriedades do file env estejam globalmente.
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note');
const Pessoa = require('./models/pessoa');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
};

app.use(requestLogger);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
})

// NOTES
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        }).catch(error =>next(error));
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    }).catch(error => next(error));
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id).then(result => {
        if (result) {
            console.log('objeto removido: ', result);
        } else {
            console.log('objeto não existe');
        }
        response.status(204).end();
    }).catch(error => next(error));
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body;

    // o param opcional {new: true} faz com que o event handler mostre o novo objeto atualizado, não o objeto original que está sendo modificado 
    // o findByIdAndUpdate não faz verificação do schema, logo não aplica as validações no objeto
    Note.findByIdAndUpdate(
        request.params.id, 
        { content, important }, 
        { new: true, runValidators: true, context: 'query' }
    ).then( updatedNote => {
        response.json(updatedNote);
    }).catch(error => next(error));
})

// PESSOA
app.get('/api/pessoas', (request, response) => {
    Pessoa.find({}).then(pessoas => {
      response.json(pessoas)
    })
})

app.post('/api/pessoas', (request, response) => {
    const body = request.body
  
    if (body.nome === undefined) {
      return response.status(400).json({ error: 'nome missing' })
    }

    if (body.sobrenome === undefined) {
      return response.status(400).json({ error: 'sobrenome missing' })
    }

    if (body.idade === undefined) {
      return response.status(400).json({ error: 'idade missing' })
    }
  
    const pessoa = new Pessoa({
        nome: body.nome,
        sobrenome: body.sobrenome,
        idade: body.idade,
        date: new Date(),
    })
  
    pessoa.save().then(savedPessoa => {
      response.json(savedPessoa)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {

    console.error(error.mensage);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});