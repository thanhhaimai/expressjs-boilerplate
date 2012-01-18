module.exports = function(app) {
  app.get('/default', function(req, res) {
    res.redirect('/');
  });

  app.get('/', function(req, res) {
    req.flash('info', "Flash testing. Delete me in routes/default.js");
    res.render('index', {
      page: 'index',
    });
  });
};
