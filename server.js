/** Setting up dependencies. */
var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose');
var mongoStore = require('connect-mongodb');
var schema = require('./schema.js');
var fs = require('fs');
var nodemailer = require('nodemailer');
var sanitizer = require('validator').sanitize;

/** Config. */
var config = JSON.parse(fs.readFileSync('private/config'));
var port = process.env.PORT || config.port;

/** Database. */
var db;

/** Flash message support. */
app.helpers(require('./dh.js').helpers);
app.dynamicHelpers(require('./dh.js').dynamicHelpers);


app.set('db-uri', config.dburi);

/** Database models. */
schema.defineModels(mongoose, function() {
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect(app.set('db-uri'));
});

/** Set up server, session management. */
app.use(express.favicon(__dirname + '/public/favicon.ico', {
  maxAge: FAVICON_LIFETIME
}));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'this sucks',
  store: mongoStore(db)
}));
app.use(express.static(__dirname + '/public'));

app.use(loadUser);
if (DEBUG_USER) {
  app.use(logUser);
}
app.use(checkUser);
app.use(validator);

app.use(app.router);
app.use(express.errorHandler({
  showStack: true,
  dumpExceptions: true
}));

/** Where to look for templates. */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index', {
    page: 'dashboard',
    currentUser: req.currentUser
  });
});

/** Redirect everything else back to default if logged in. */
app.get('*', function(req, res) {
  trace('GET URL: ' + req.url);
  req.flash('error', "Whoops! The url you just went to does not exist.");
  res.redirect('/default');
});

app.listen(port);