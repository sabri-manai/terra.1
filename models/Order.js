const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({

phone: {
    type: String,
    required: true
},

name: {
    type: String,
},

productName: {
        type: String,
        required: true
    },

price: {
        type: String,
        required: true
    },

email: {
        type: String,
        required: true
    },
product_id: {
    type: String,
    required: true
},
created_at: {
    type: Date,
    required: true
},
})

orderSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return emailRegex.test(val);
}, 'Invalid e-mail.');

let Order = mongoose.model('Order', orderSchema, 'orders')
module.exports = Order