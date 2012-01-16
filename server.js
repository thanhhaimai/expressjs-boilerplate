/** Setting up dependencies. */
var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose');
var mongoStore = require('connect-mongodb');
var fs = require('fs');
var nodemailer = require('nodemailer');
var sanitizer = require('validator').sanitize;

/** Config. */
var config = JSON.parse(fs.readFileSync("private/config"));
var port = process.env.PORT || config.port;

/** Database. */
var db;
app.set('db-uri', config.dburi);

/** Default cookie lifetime is 1 day. */
var COOKIE_LIFETIME = 1000 * 60 * 60 * 24;
/** Default fav icon lifetime is 30 days. */
var FAVICON_LIFETIME = 1000 * 60 * 60 * 24 * 30

/** Flash message support. */
app.helpers(require('./dh.js').helpers);
app.dynamicHelpers(require('./dh.js').dynamicHelpers);

/** Database models. */
require('./models').defineModels(mongoose, function() {
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
  secret: 'this is not a secret secret',
  store: mongoStore(db)
}));
app.use(express.static(__dirname + '/public'));

//app.use(loadUser);

app.use(app.router);
app.use(express.errorHandler({
  showStack: true,
  dumpExceptions: true
}));

/** Where to look for templates. */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

require('./routes')(app);

app.listen(port);