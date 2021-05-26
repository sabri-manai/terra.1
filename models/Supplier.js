const mongoose = require('mongoose')
const supplierSchema = new mongoose.Schema({

supplierPic: {
        type: String,
},

name: {
    type: String,
    required: true
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
   
phone: {
        type: String,
        required: true
    },

})

let Suppliere = mongoose.model('Supplier', supplierSchema, 'suppliers')
module.exports = Suppliere