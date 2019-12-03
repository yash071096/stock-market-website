const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/mystock', ensureAuthenticated, (req, res) =>
  res.render('mystock', {
    user: req.user
  })
);

router.get('/mybankaccount', ensureAuthenticated, (req, res) =>
  res.render('mybankaccount', {
    user: req.user
  })
);

router.get('/user_profile', ensureAuthenticated, (req, res) =>
  res.render('user_profile', {
    user: req.user
  })
);
router.get('/stockhist', ensureAuthenticated, (req, res) =>
  res.render('stockhist', {
    user: req.user
  })
);
router.get('/forgot_password', (req, res) =>
  res.render('forgot_password')
);
router.get('/reset_password', (req, res) =>
  res.render('reset_password')
);


module.exports = router;
