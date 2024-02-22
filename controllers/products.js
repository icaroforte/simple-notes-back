const productsRouter = require('express').Router();
const Product = require('../models/product');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }

    return null;
};

productsRouter.get('/', async (request, response) => {
    const products = await Product.find({});
    response.json(products);
})

productsRouter.get('/:id', async (request, response) => {
    await Product.findById(request.params.id).then(product => {
        response.json(product);
    });
})

productsRouter.post('/', async (request, response) => {
    const body = request.body;
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);

    if (!body.name || !user) {
        console.log('error: "content missing"');
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const product = new Product({
        name: body.name,
        price: body.price,
        description: body.description
    });

    const savedProduct = await product.save();

    response.json(savedProduct);
})

productsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const product = {
        name: body.name,
        price: body.price,
        description: body.description
    };

    await Product.findByIdAndUpdate(request.params.id, product, { new: true }).then(productUpdated => {
        response.json(productUpdated);
    });
})

productsRouter.delete('/:id', async (request, response) => {
    await Product.findByIdAndDelete(request.params.id).then(product => {
        response.status(204).end();
    });
})

module.exports = productsRouter;