module.exports = function(app) {
  app.get('/login', function(req, res) {
    res.render('login', {
      page: 'login',
    });
  });
  app.post('/login', function(req, res) {
    req.sanitize('user', 'username');
    req.sanitize('user', 'password');
    res.redirect('/default');
  });
};
