const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const pessoaSchema = new mongoose.Schema({
    nome: String,
    sobrenome: String,
    idade: Number,
    date: Date,
});

pessoaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pessoa', pessoaSchema)