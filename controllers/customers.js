const customerRouter = require('express').Router();
const User = require('../models/user');
const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }

    return null;
};

customerRouter.get('/', async (request, response) => {
    const customers = await Customer.find({});
    response.json(customers);
})

customerRouter.get('/:id', async (request, response) => {
    await Customer.findById(request.params.id).then(customer => {
        response.json(customer);
    });
})

customerRouter.post('/', async (request, response) => {
    const body = request.body;
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    console.log('body', body)
    const user = await User.findById(decodedToken.id);

    if (!body.name) {
        console.log('error: "name missing"');
        return response.status(400).json({
            error: 'name missing'
        });
    } else if (!user) {
        console.log('error: "user unknow"');
        return response.status(400).json({
            error: 'user unknow'
        });
    }

    const customer = new Customer({
        address: {
            street: body.address.street,
            number: body.address.number,
            neighborhood: body.address.neighborhood,
            city: body.address.city,
            state: body.address.state,
            country: body.address.country,
            zipCode: body.address.zipCode,
            reference: body.address.reference,
        },
        cpfCnpj: body.cpfCnpj,
        email: body.email,
        name: body.name,
        order: [],
        phone: body.phone,
    });

    const savedCustomer = await customer.save();

    response.json(savedCustomer);
})

customerRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const customer = new Customer({
        address: body.address,
        email: body.email,
        name: body.name,
        phone: body.phone,
        _id: request.params.id
    });

    await Customer.findByIdAndUpdate(request.params.id, customer, { new: true }).then(customerUpdated => {
        response.json(customerUpdated);
    });
})

customerRouter.delete('/:id', async (request, response) => {
    await Customer.findByIdAndDelete(request.params.id).then(customer => {
        response.status(204).end();
    });
})

module.exports = customerRouter;