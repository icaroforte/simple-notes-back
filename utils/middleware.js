const { infoLog, errorLog } = require('./logger')

const requestLogger = (request, response, next) => {
  infoLog('Method:', request.method)
  infoLog('Path:  ', request.path)
  infoLog('Body:  ', request.body)
  infoLog('---')
  next()
}

const unknownEndpoint = (request, response) => {
  infoLog('Wrong URL', request.path)
  response.status(301).redirect('/');
}

const errorHandler = (error, request, response, next) => {
  errorLog(error.message)

  const errorName = {
    'CastError': () => response.status(400).send({ error: 'malformatted id' }),
    'ValidationError': () => response.status(400).json({ error: error.message }),
    'JsonWebTokenError': () => response.status(401).json({ error: 'invalid token' }),
    'TokenExpiredError': () => response.status(401).json({ error: 'token expired' }),
    'default': () => next(error),
  };

  return errorName[error.name || 'default']();
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
