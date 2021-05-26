const express = require("express")
const app = express()
const db = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')


app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('node_modules'))

app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())


app.get('*', (req,res,next)=> {
   ( res.locals.user = req.user || null)
    next()
})

app.get('/', (req,res)=> {

   res.redirect('/articles')
    
})

const articles = require('./routes/article-routes')
app.use('/articles', articles)

const suppliers = require('./routes/supplier-routes')
app.use('/suppliers', suppliers)

const users = require('./routes/user-routes')
app.use('/users', users)

const products = require('./routes/product-routes')
app.use('/products', products)


app.listen(5000, ()=> {

    console.log(' app is wokring on port 5000')
})
