const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Article = require('../models/Article')

const passport = require('passport')
const multer = require("multer")
const { check, validationResult } = require('express-validator/check')


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
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}
//  login user view 
router.get('/login', (req,res,)=> {
    return res.render('user/login', {
        error: req.flash('error')
    })
})

router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/users/profile',
      failureRedirect: '/users/login',
      failureFlash: true })
      )


router.get('/signup' ,(req,res)=> {

    res.render('user/signup', {
        error: req.flash('error')
    })

 })


router.post('/signup', 
  passport.authenticate('local.signup', {
    successRedirect: '/users/profile',
      failureRedirect: '/users/signup',
      failureFlash: true })
      )




    

router.get('/edit',isAuthenticated, (req,res)=> {

    res.render('user/edit', {
        success: req.flash('success')
    })
    })

router.get('/userInfo',isAuthenticated, (req,res)=> {

        User.find({}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
               res.render('user/userInfo',{users:allUsers});
            }
         });
        
     });

 


    
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
  





router.post('/uploadAvatar', upload.single('avatar'), (req,res)=> {
    
    let newFields = {
        avatar: req.file.filename
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/users/profile')
        }

    } )
})

router.post('/edit', isAuthenticated, (req,res)=> {
    
    let newFields = {
        position: req.body.position,
        location: req.body.location,
        mobile: req.body.mobile,
        city: req.body.city,
        dateOfBirth: req.dateOfBirth.city
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/users/profile')
        }

    } )
})








router.get('/profile/:pageNo?', isAuthenticated, (req,res)=> {  
    


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
                  res.render('user/profile', {
                      chunk : chunk,
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  })
             })
    })
})







router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/users/login');
})


module.exports = router