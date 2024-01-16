const { infoLog, errorLog } = require('./logger')

const requestLogger = (request, response, next) => {
  infoLog('Method:', request.method)
  infoLog('Path:  ', request.path)
  infoLog('Body:  ', request.body)
  infoLog('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  errorLog(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
