var sanitizer = require('validator').sanitize;

/** Validator middleware .*/
function validator(req, res, next) {
  req.sanitize = function(obj, prop, op) {
    if (req.body[obj][prop]) {
      if (!op) {
        op = 'entityEncode';
      }
      req.body[obj][prop] = sanitizer(req.body[obj][prop])[op]().trim();
    }
  };
  next();
}

/** Santizier */
module.exports = function(app) {
  app.use(validator);
};
