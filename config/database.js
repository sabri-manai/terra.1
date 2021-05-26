const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
let db = mongoose.connect('mongodb+srv://sabri:Sabrout25524295!@cluster0.eels9.azure.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false } , (err)=> {

    if (err) {
        console.log(err)
    } else {
        console.log('connected to db')
    }
})


