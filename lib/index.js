var fs = require('fs');
var util = require('util');

module.exports = function(app) {
  /** Application helper. */
  app.helpers({
    appName: 'expressjs-boilterplate',
    version: '0.0.1',
    nameAndVersion: function(name, version) {
      return name + ' v' + version;
    }
  });
  /** Load all the routes in ./routes .*/
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") {
      return;
    }
    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app);
  });
};
