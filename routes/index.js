var fs = require('fs');
var util = require('util');

module.exports = function(app) {
  /** Load all the routes in ./routes .*/
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") {
      return;
    }
    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app);
  });
  /** Redirect everything else back to default if logged in. */
  app.get('*', function(req, res) {
    res.render('errors/404', {
      status: 404
    });
  });
}