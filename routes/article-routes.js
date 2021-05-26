const express = require("express")
const router = express.Router()
const Article = require('../models/Article')
const User = require('../models/User')
const multer = require("multer")
const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
moment().format();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png') 
    }
  })
  
  var upload = multer({ storage: storage })

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) 
    return next()
    res.redirect('/users/login')
}

// Get Creation page of articles

router.get('/create',isAuthenticated, (req,res)=> {
   
    res.render('article/create', {
        errors: req.flash('errors')
    })
})

// Create article (post)

router.post('/create', [
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 10}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should be valid '),
    check('content').isLength({min: 50}).withMessage('You should write more '),
    check('subject').isLength({min: 3}).withMessage('please enter a subject '),


] , isAuthenticated, (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/articles/create')
    } else {
        
        let newArticle = new Article({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            content: req.body.content,
            location: req.body.location,
            subject: req.body.subject,
            user_id:  req.user.id,
            articlePic: "aqua1.png",
            created_at: Date.now()
        })

        newArticle.save( (err)=> {
            if(!err) {
                console.log('article was added')
                req.flash('info', ' The article was created successfuly')
                res.redirect('/articles')
            } else {
                console.log(err)
            } 
        })
    }
   
})

// Post article picture 
router.post('/uploadArticlePic', upload.single('articlePic'), isAuthenticated, (req,res)=> {
    
    let newFields = {
        articlePic: req.file.filename
    }
    let query = {_id: req.body.id}

    Article.updateOne(query, newFields, (err)=> {
        if(!err) {
            req.flash('info', " The article was updated successfuly"),
            res.redirect('/articles' )
        } else {
            console.log(err)
        }
    })
})

// Get page of articles (index)

router.get('/:pageNo?', (req,res)=> {   
    let pageNo = 1

    if ( req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0)   {
        pageNo = 1
    }
    
    let q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    }
    let totalDocs = 0 

    Article.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocs = parseInt(response)
        Article.find({},{},q, (err,articles)=> {
                 let chunk = []
                 let chunkSize = 3
                 for (let i =0 ; i < articles.length ; i+=chunkSize) {
                     chunk.push(articles.slice( i, chunkSize + i))
                 }
                  res.render('article/index', {
                      chunk : chunk,
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  })
             })
    })
})


// show an article

router.get('/show/:id', (req,res)=> {
    Article.findOne({_id: req.params.id}, (err,article)=> {
        
       if(!err) {
           
        res.render('article/show', {
            article: article
                                    })
                }
        else {
           console.log(err)
             }   
                                                            }) 
})

// Get edit article page

router.get('/edit/:id', isAuthenticated,(req,res)=> {

    Article.findOne({_id: req.params.id}, (err,article)=> {
        
        if(!err) {
       
         res.render('article/edit', {
             article: article,
             articleDate: moment(article.date).format('YYYY-MM-DD'),
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})


// Update an article 

router.post('/update',[
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 10}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should be valid '),
    check('content').isLength({min: 50}).withMessage('You should write more '),
    check('subject').isLength({min: 3}).withMessage('please enter a subject '),

], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/articles/edit/' + req.body.id)
    } else {
       // update obj
       let newfeilds = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        content: req.body.content,
        location: req.body.location,
        subject: req.body.subject,
        user_id:  req.user.id,
        created_at: Date.now()
       }
       let query = {_id: req.body.id}

       Article.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The article was updated successfuly"),
               res.redirect('/articles/edit/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})


// Delete article

router.get('/delete/:id', isAuthenticated, (req, res) => {
    Article.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/articles');
        }
        else { console.log('Error in article delete :' + err); }
    });
});


module.exports = router 