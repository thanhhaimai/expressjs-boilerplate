module.exports = function(app) {
  app.get('/default', function(req, res) {
    res.redirect('/');
  });

  app.get('/', function(req, res) {
    res.render('index', {
      page: 'index',
      currentUser: req.currentUser
    });
  });
}