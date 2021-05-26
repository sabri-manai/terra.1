const express = require("express")
const app2 = express()
const app1 = express()
const db = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')


const handler = serverNum => (req, res) => {
    console.log(`server ${serverNum}`, req.method, req.url, req.body);
    res.send(`Hello from server ${serverNum}!`);

  };

app2.set('view engine', 'ejs')
app1.set('view engine', 'ejs')


app2.use(bodyParser.urlencoded({ extended: false }))
app1.use(bodyParser.urlencoded({ extended: false }))

app2.use(bodyParser.json())
app1.use(bodyParser.json())



app2.use(express.static('public'))
app1.use(express.static('public'))

app2.use(express.static('uploads'))
app1.use(express.static('uploads'))

app2.use(express.static('node_modules'))
app1.use(express.static('node_modules'))


app2.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app1.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app2.use(flash())
app1.use(flash())


app2.use(passport.initialize())
app1.use(passport.initialize())

app2.use(passport.session())
app1.use(passport.session())



app2.get('*',  handler(2)).post('*', handler(2), (req,res,next)=> {
   ( res.locals.user = req.user || null)
    next()
})

app1.get('*',  handler(1)).post('*', handler(1), (req,res,next)=> {
    ( res.locals.user = req.user || null)
     next()
 })


app1.get('/', handler(1)).post('*', handler(1), (req,res)=> {

   res.redirect('/articles')
    
})

app2.get('/', handler(2)).post('*', handler(2), (req,res)=> {

    res.redirect('/articles')
     
 })


const articles = require('./routes/article-routes')
app1.use('/articles', articles)
app2.use('/articles', articles)

const suppliers = require('./routes/supplier-routes')
app1.use('/suppliers', suppliers)
app2.use('/suppliers', suppliers)

const users = require('./routes/user-routes')
app1.use('/users', users)
app2.use('/users', users)


const products = require('./routes/product-routes')
app1.use('/products', products)
app2.use('/products', products)



app1.listen(5000, ()=> {

    console.log(' app is wokring on port 5000')
})

app2.listen(5001, ()=> {

    console.log(' app is wokring on port 5001')
})

