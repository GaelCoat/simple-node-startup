"use strict";

var q = require('q');
var _ = require('underscore');
var passport = require('passport');
var express = require('express');
var router = express.Router();

var auth = require('../auth');


module.exports = function(app) {

  // --------------------------------------------------
  // Home
  // --------------------------------------------------
  app.route('/').get(function(req, res) {

    if (req.isAuthenticated()) res.render('index');
    else res.render('login');
  });


  // --------------------------------------------------
  // La liste des routes spécifiques
  // --------------------------------------------------
  //app.use('/auth', require('./auth'));

  return app;
}

