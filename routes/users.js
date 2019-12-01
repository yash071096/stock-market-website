const express = require('express');
const router = express.Router();
//const app = express.Router
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, physical_address1, physical_address2, physical_address3, p_name, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !physical_address1 || !physical_address2 || !physical_address3 || !p_name || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });

  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      physical_address1,
      physical_address2,
      physical_address3,
      p_name,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          physical_address1,
          physical_address2,
          physical_address3,
          p_name,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          physical_address1,
          physical_address2,
          physical_address3,
          p_name,
          password
        });
        console.log(newUser);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//user_profile_edit
router.post('/user_profile', (req, res, next) => {
  const {name,physical_address1,physical_address2,physical_address3} = req.body;
  const id = req.user._id;
  User.findOneAndUpdate(
    {_id: id},
    {$set:{name:name, physical_address1:physical_address1, physical_address2:physical_address2, physical_address3:physical_address3}},
    {new:true},
    function(err,model){
      if(err){
        console.log(error);
        res.send({update:false});
      } else{
        console.log(model);
        res.send({update:true});
      }
    });
});

//forgot password
router.post('/user_profile', (req, res, next) => {
  const {name,physical_address1,physical_address2,physical_address3} = req.body;
  const id = req.user._id;
  User.findOneAndUpdate(
    {_id: id},
    {$set:{name:name, physical_address1:physical_address1, physical_address2:physical_address2, physical_address3:physical_address3}},
    {new:true},
    function(err,model){
      if(err){
        console.log(error);
        res.send({update:false});
      } else{
        console.log(model);
        res.send({update:true});
      }
    });
});


module.exports = router;
