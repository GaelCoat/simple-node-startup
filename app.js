var lusca = require('lusca');
var morgan = require('morgan');
var config = require('config');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var serveStatic = require('serve-static');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
//var debug = require('debug')('rementis:admin');
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./api/models/user');

// On expose le serveur express
var app = module.exports = express();


app.use(serveStatic(__dirname + '/app/build', {
  index: false,
  maxAge: '10d',
}));

app.set('x-powered-by', 'Brain connection');
app.set('view engine', 'pug');
app.set('views', __dirname + '/app/views/');

app.use(cookieParser());
app.use(methodOverride());

app.use(session(config.session));


app.use(bodyParser.json({ limit:'1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit:'10mb' }));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Connexion à la base de données
/*require('./lib/connection')(function() {
  debug('Connection to mongodb etablished...');
});*/

// On gère passport
app.use(passport.initialize());
app.use(passport.session());

//app.use(morgan(':remote-addr / :req[x-forwarded-for] - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(morgan('- Request'));

app.use(lusca({
    // csrf: true,
    // csp: { /* ... */},
    xframe: 'SAMEORIGIN',
    // p3p: 'ABCDEF',
    // hsts: {maxAge: 31536000, includeSubDomains: true},
    xssProtection: true
}));

passport.use(new LocalStrategy( function(username, password, done) {

  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (!user.verifyPassword(password)) { return done(null, false); }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

// On injecte les locals dans les vues
app.use(function(req, res, next) {

  if (req.user) res.locals.currentUser = req.user;
  next();
});

app.use(errorHandler({ dumpExceptions: true, showStack: true }));

require('./api/routes')(app);
