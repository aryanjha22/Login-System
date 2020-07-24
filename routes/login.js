const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/user')

// renders
router.get('/', (req,res) => {
    res.render('Homepage')
});

router.get('/signup', (req,res) => {
    res.render('Signup')
});

router.get('/welcome', (req,res) => {
    res.render('welcome')
})

// conditions
router.post('/signup', (req,res) => {
    const{first_name, last_name, email, password, password_confirmation} = req.body;
    let errors = [];

    if(password !== password_confirmation){
        errors.push({msg : 'Password do not match!'})
    }

    if(password.length < 6){
        errors.push({msg : 'Password should be atleast 6 chars!'})
    }
    
    if(errors.length > 0){
        res.render('Signup', {
            errors
        })
    }
    else{
        User.findOne({email : email})
        .then(user => {
            if(user){
                errors.push({msg : 'Email is already registered!'})
                res.render('Signup', {
                    errors
                });
            }

            else{
                const newUser = new User({
                    first_name,
                    last_name,
                    email,
                    password
                });
                
                //bcrypt password hashing

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;

                        newUser.password = hash;

                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered!')
                                res.redirect('/');
                            })
                            .catch(err => console.log(err));
                }))
            }
        });

    }

});


// passport authentication
router.post('/', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect : '/welcome',
        failureRedirect : '/',
        failureFlash : true
    }) (req, res, next);
});

module.exports = router;