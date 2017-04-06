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
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);

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

app.use(bodyParser.json({ limit:'1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Connexion à la base de données
require('./api/connection')(function() {
  console.log('Connection to mongodb etablished...');
});

app.use(session({
  secret: config.get('session').secret,
  cookie: config.get('session').cookie,
  resave: config.get('session').resave,
  saveUninitialized: config.get('session').saveUninitialized,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// On gère passport
app.use(passport.initialize());
app.use(passport.session());

//app.use(morgan(':remote-addr / :req[x-forwarded-for] - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(morgan(':method :url'));

app.use(lusca({
    // csrf: true,
    // csp: { /* ... */},
    xframe: 'SAMEORIGIN',
    // p3p: 'ABCDEF',
    // hsts: {maxAge: 31536000, includeSubDomains: true},
    xssProtection: true
}));


passport.serializeUser(function(user, done) {

  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'mail'
  },
  function(req, mail, password, done) {
    User.findOne({ 'mail' :  mail },
      function(err, user) {
        if (err) return done(err);
        if (!user){
          console.log('User Not Found with mail '+mail);
          return done(null, false);
        }
        if (!user.comparePassword(password)){
          console.log('Invalid Password');
          return done(null, false);
        }
        return done(null, user);
      }
    );
}));

// On injecte les locals dans les vues
app.use(function(req, res, next) {

  if (req.user) res.locals.currentUser = req.user;
  next();
});

require('./api/routes')(app);
