const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({

productId: {
    type: String,
    required: true
},

productPic: {
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

productDescription: {
        type: String,
        required: true
    },
})

let Product = mongoose.model('Product', productSchema, 'products')
module.exports = Product