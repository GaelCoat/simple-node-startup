var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');

router.route('/signin').post(function(req, res) {

  var newUser = new User({
    username: req.body.username,
    mail: req.body.mail,
    password: req.body.password
  });

  newUser.save(function (err, result) {
    if(err) return res.redirect('/');
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });

});


router.route('/login').post(
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/'})
);

router.route('/logout').get(function(req, res) {

  req.logout();
  req.session.destroy();
  res.redirect('/login');
});


module.exports = router;
