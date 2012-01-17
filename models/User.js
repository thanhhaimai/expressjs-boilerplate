/** Encryption dependencies. */
var crypto = require('crypto');

module.exports = function(mongoose, app) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  /** A user. */
  User = new Schema({
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    hashed_password: {
      type: String,
      required: true
    }
  });

  /** Password conversion. */
  User.virtual('password').set(function(password) {
    this.salt = randomToken();
    this.hashed_password = this.encryptPassword(password);
  });
  /** Password authentication. */
  User.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  /** Password encryption. */
  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  mongoose.model('User', User);
  app.User = mongoose.model('User');
}
