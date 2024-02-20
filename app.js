const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const customersRouter = require('./controllers/customers');
const productsRouter = require('./controllers/products');
const ordersRouter = require('./controllers/orders');
const middleware = require('./utils/middleware');
const { infoLog, errorLog } = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

infoLog('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        infoLog('connected to MongoDB');
    })
    .catch((error) => {
        errorLog('error connecting to MongoDB:', error.message);
    })

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app