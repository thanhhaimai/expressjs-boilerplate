var fs = require('fs');

/** Defines schemas for different collections. */
exports.defineModels = function defineModels(mongoose, next) {
  /** Load all the models in ./models .*/
  fs.readdirSync(__dirname).forEach(function(file) {
    if(file == "index.js") {
      return;
    }
    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(mongoose);
  });

  next();
}
