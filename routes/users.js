const express = require('express');
const router = express.Router();

// Bring in Models
let User = require('../models/users');

// Register Form
router.get('/register', function(req, res){
    res.render('register');
  });


// POST Register Form
const { check, validationResult } = require('express-validator/check');

router.post('/register', [
    check('name').isLength({min:2}).trim().withMessage('Name is required'),
    check('email').isEmail().normalizeEmail().withMessage('Email required'),
    check('username').isLength({min:2}).trim().withMessage('Body required'),
    check('password').isLength({min:2}).trim().withMessage('Password required'),
    check('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        else {
            return true;
        }
        }),
] ,function(req, res){

    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.password2 = req.body.password2;

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render('register',{
            user:user,
            errors:errors.mapped()
        });
    }
    else {
        req.flash('success','We can register');
        res.redirect('/users/register');
    }
  });

module.exports = router;