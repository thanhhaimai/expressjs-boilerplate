/** Setting up dependencies. */
var fs = require('fs');
var util = require('util');
var express = require('express');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongodb');
var sanitizer = require('validator').sanitize;

/** .*/
var config = require('./config');
var app = module.exports = express.createServer();
var db;

/** Database models. */
require('./models').defineModels(mongoose, app, function() {
  db = mongoose.connect(config.dburi);
});

/** .*/
process.addListener('uncaughtException', function(err, stack) {
  util.log('Caught exception: ' + err + '\n' + err.stack);
  util.log('\u0007');
});

/** Flash message support. */
app.helpers(require('./dh.js').helpers);
app.dynamicHelpers(require('./dh.js').dynamicHelpers);
/** Where to look for templates. */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
/** Set up server, session management. */
app.use(express.favicon(__dirname + '/public/favicon.ico', {
  maxAge: config.FAVICON_LIFETIME
}));

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: config.secret,
  store: mongoStore(db)
}));

app.use(express.logger({
  format: ':req[x-real-ip] :date (:response-time ms): :method :url'
}));

app.use(express.static(__dirname + '/public', {
  maxAge: config.COOKIE_LIFETIME
}));

app.use(app.router);

/** Show all errors and keep search engines out using robots.txt .*/
app.configure('development', function() {
  app.use(express.errorHandler({
    showStack: true,
    dumpExceptions: true
  }));
  app.all('/robots.txt', function(req, res) {
    res.send('User-agent: *\nDisallow: /', {
      'Content-Type': 'text/plain'
    });
  });
});
/** Suppress errors, allow all search engines .*/
app.configure('production', function() {
  app.use(express.errorHandler({
    dumpExceptions: true
  }));
  app.all('/robots.txt', function(req, res) {
    res.send('User-agent: *', {
      'Content-Type': 'text/plain'
    });
  });
});

/** Load all the routes. */
require('./routes')(app);

/** Start listenning. */
app.listen(config.port);
util.log(util.format('ENV: %s, listening on http://localhost:%s', config.env, config.port));
