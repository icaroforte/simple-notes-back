const ordersRouter = require('express').Router();
const Order = require('../models/order');
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

ordersRouter.get('/', async (request, response) => {
    const orders = await Order.find({});
    response.json(orders);
})

ordersRouter.get('/:id', async (request, response) => {
    await Order.findById(request.params.id).then(order => {
        response.json(order);
    });
})

ordersRouter.post('/', async (request, response) => {
    const body = request.body;
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    const customer = await Customer.findById(body.customer);
    console.log('customer', customer);

    if (!body.customer || !user) {
        console.log('error: "content missing"');
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const order = new Order({
        customer: body.customer,
        start_date: Date.now(),
        delivery_date: body.deadline,
        deadline: body.deadline,
        total_amount: body.total_amount,
        partial_amount: body.partial_amount,
        description: body.description,
        products: body.products,
    });

    const orderedProduct = await order.save();
    customer.order = customer.order.concat(orderedProduct._id);
    await customer.save();

    response.json(orderedProduct);
})

ordersRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const product = {
        name: body.name,
        price: body.price
    };

    const order = {
        delivery_date: body.deadline,
        deadline: body.deadline,
        total_amount: body.total_amount,
        partial_amount: body.partial_amount,
        description: body.description,
        products: body.products,
    };

    await Order.findByIdAndUpdate(request.params.id, order, { new: true }).then(orderUpdated => {
        response.json(orderUpdated);
    });
})

ordersRouter.delete('/:id', async (request, response) => {
    await Order.findByIdAndDelete(request.params.id).then(order => {
        response.status(204).end();
    });
})

module.exports = ordersRouter;