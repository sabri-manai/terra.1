const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const User = require('../models/User')
const Order = require('../models/Order')

const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
      moment().format();
const multer = require("multer")
const { route } = require('./supplier-routes')

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) 
    return next()
    res.redirect('/users/login')
}


      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/images')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + '.png') 
        }
      })
      
      var upload = multer({ storage: storage })

// Get products
router.get('/addProduct',isAuthenticated, (req,res)=> {

    res.render('product/addProduct', {
        success: req.flash('success')
    })
    })

// Add product 
router.post('/createProduct', [
    check('productName').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('productDescription').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('price').isLength({min: 2}).withMessage('Please specifiy a correct price'),
    check('productId').isLength({min: 1}).withMessage('Please enter the product Id'),

] , isAuthenticated, (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/products/addProduct')
    } else {
        
        let newProduct = new Product({
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            price: req.body.price,
            productId: req.body.productId,
            productPic: "aqua1.png",

            created_at: Date.now()
        })

        newProduct.save( (err)=> {
            if(!err) {
                console.log('product added successfully')
                req.flash('info', ' The product was created successfuly')
                res.redirect('/products/ViewProduct')
            } else {
                console.log(err)
            } 
        })
    } 
})

// Product picture 
router.post('/uploadProductPic', upload.single('productPic'), isAuthenticated, (req,res)=> {
    
    let newFields = {
        productPic: req.file.filename
    }
    let query = {_id: req.body.id}

    Product.updateOne(query, newFields, (err)=> {
        if(!err) {
            req.flash('info', " The product was updated successfuly"),
            res.redirect('/products/ViewProduct' )
        } else {
            console.log(err)
        }
    })
})


// View product

router.get('/viewProduct', (req,res)=> {
    
    Product.find({}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            return   res.render('product/viewProduct',{products:allProducts});
        }
     });
 });

 //show product

router.get('/showProduct/:id', (req,res)=> {
    Product.findOne({_id: req.params.id}, (err,product)=> {
        
       if(!err) {
           
        res.render('product/showProduct', {
            product: product
                                    })
                }
        else {
           console.log(err)
             }   
                                                            }) 
})

// Get edit product page

router.get('/editProduct/:id', isAuthenticated,(req,res)=> {

    Product.findOne({_id: req.params.id}, (err,product)=> {
        
        if(!err) {
       
         res.render('product/editProduct', {
             product: product,
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})

//post edit product

router.post('/updateProduct',[
    check('productName').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('productDescription').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('price').isLength({min: 2}).withMessage('Please specifiy a correct price'),
    check('productId').isLength({min: 1}).withMessage('Please enter the product Id'),

], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/products/editProduct/' + req.body.id)
    } else {
       // update obj
       let newfeilds = {
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        price: req.body.price,
        productId: req.body.productId,
       }
       let query = {_id: req.body.id}

       Product.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The product was updated successfuly"),
               res.redirect('/products/ViewProduct' )
           } else {
               console.log(err)
           }
       })
    }
   
})

// fill order details

router.get('/makeOrder/:id', (req,res)=> {
    Product.findOne({_id: req.params.id}, (err,product)=> {
        
       if(!err) {
           
        res.render('product/makeOrder', {
            product: product
                                    })
                }
        else {
           console.log(err)
             }   
                                                            }) 
})

// confirm  order 
router.post('/order', [
    check('name').isLength({min: 7}).withMessage(' Please enter your full name'),
    check('phone').isLength({min: 8}).withMessage('Please enter a correct phone number'),

] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/products/makeOrder')
    } else {
        
        let newOrder = new Order({
            productName: req.body.productName,
            price: req.body.price,
            product_id: req.body.product_id,
            email: req.body.email,
            phone: req.body.phone,
            name: req.body.name,

            created_at: Date.now()
        })

        newOrder.save( (err)=> {
            if(!err) {
                console.log('Order added successfully')
                req.flash('info', ' Your order is confirmed ')
                res.redirect('/products/viewOrder')
            } else {
                console.log(err)
            } 
        })
    } 
})

router.get('/viewOrder', (req,res)=> {
      res.render('product/viewOrder')
}) 

// Delete product

router.get('/delete/:id', isAuthenticated, (req, res) => {
        if(req.user.isAuthor()){

            Product.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err) {
                    res.redirect('/products/ViewProduct');
                }
                else { console.log('Error in product delete :' + err); }
            });
        } else{
            res.sendStatus(403) // Forbidden
    }
    });


    module.exports = router