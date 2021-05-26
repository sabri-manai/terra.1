const express = require('express')
const router = express.Router()
const Supplier = require('../models/Supplier')
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
// Get suppliers
router.get('/addSupplier',isAuthenticated, (req,res)=> {

    res.render('supplier/addSupplier', {
        success: req.flash('success')
    })
    })

// Add suppliers (post) 
router.post('/createSupplier', [
    check('productName').isLength({min: 5}).withMessage('Product should be more than 5 char'),
    check('name').isLength({min: 5}).withMessage('Supplier name should be more than 5 char'),
    check('phone').isLength({min: 5}).withMessage('phone  should contain 8 numbers'),
    check('price').isLength({min: 2}).withMessage('Please specifiy a correct price'),
    check('email').isLength({min: 7}).withMessage('Please enter a correct email'),

] , isAuthenticated, (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/suppliers/createSupplier')
    } else {
        
        let newSupplier = new Suppliere({
            productName: req.body.productName,
            name: req.body.name,
            price: req.body.price,
            phone: req.body.phone,
            email: req.body.email,

            created_at: Date.now()
        })

        newSupplier.save( (err)=> {
            if(!err) {
                console.log('supplier added successfully')
                req.flash('info', ' The supplier was added successfuly')
                res.redirect('/articles')
            } else {
                console.log(err)
            } 
        })
    } 
})

// Supplier picture 
router.post('/uploadSupplierPic', upload.single('supplierPic'), isAuthenticated, (req,res)=> {
    
    let newFields = {
        supplierPic: req.file.filename
    }
    let query = {_id: req.body.id}

    Supplier.updateOne(query, newFields, (err)=> {
        if(!err) {
            req.flash('info', " The supplier was updated successfuly"),
            res.redirect('/suppliers/viewSupplier' )
        } else {
            console.log(err)
        }
    })
})


// View Suppliers 

router.get('/viewSupplier',isAuthenticated, (req,res)=> {

    Supplier.find({}, function(err, allSuppliers){
        if(err){
            console.log(err);
        } else {
           res.render('supplier/viewSupplier',{suppliers:allSuppliers});
        }
     });
    
 });


  //show product

router.get('/showSupplier/:id', isAuthenticated, (req,res)=> {
    Supplier.findOne({_id: req.params.id}, (err,supplier)=> {
        
       if(!err) {
           
        res.render('supplier/showSupplier', {
            supplier: supplier
                                    })
                }
        else {
           console.log(err)
             }   
                                                            }) 
})

// Get edit supplier page

router.get('/editSupplier/:id', isAuthenticated,(req,res)=> {

    Supplier.findOne({_id: req.params.id}, (err,supplier)=> {
        
        if(!err) {
       
         res.render('supplier/editSupplier', {
             supplier: supplier,
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})

//post edit supplier

router.post('/updateSupplier',[
    check('productName').isLength({min: 5}).withMessage('product name should be more than 5 char'),
    check('name').isLength({min: 5}).withMessage('Supplier name should be more than 5 char'),
    check('phone').isLength({min: 5}).withMessage('phone  should contain 8 numbers'),
    check('price').isLength({min: 2}).withMessage('Please specifiy a correct price'),
    check('email').isLength({min: 7}).withMessage('Please enter a correct email'),

], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/suppliers/editSupplier/' + req.body.id)
    } else {
       // update obj
       let newfeilds = {
        productName: req.body.productName,
        name: req.body.name,
        price: req.body.price,
        phone: req.body.phone,
        email: req.body.email,
       }
       let query = {_id: req.body.id}

       Supplier.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The supplier was updated successfuly"),
               res.redirect('/suppliers/editSupplier/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})


// Delete article



router.get('/delete/:id', isAuthenticated, (req, res) => {
    Supplier.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/suppliers/viewSupplier');
        }
        else { console.log('Error in product delete :' + err); }
    });
});
module.exports = router