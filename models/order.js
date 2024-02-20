const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    start_date: {
        type: Date,
        required: true,
    },
    delivery_date: {
        type: Date,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0
    },
    partial_amount: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
    }
});

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;