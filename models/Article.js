const { timers } = require('jquery')
const mongoose = require('mongoose')
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },

    user_id : {
        type: String,
        required: true
    },
    subject : {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    articlePic: {
        type: String,
    },
})

let Article = mongoose.model('Article', articleSchema, 'articles')

module.exports = Article