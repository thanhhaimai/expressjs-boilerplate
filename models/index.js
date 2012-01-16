/** Encryption dependencies. */
var crypto = require('crypto');

/** Database Models. */
var User;
var LoginToken;

/** Default permissions set. */
var permissions = {
  Guest: 0x0
};

var emailRegEx = /^[a-z](?=[\w.]{1,31}@)\w*\.?\w*@(cs\.)*berkeley.edu$/i;
var usernameRegEx = /^[a-z][a-z0-9_-]{2,31}$/i;

/** Defines schemas for different collections. */
function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  
  /** A user. */
  User = new Schema({
    email: {
      type: String,
      index: {
        sparse: true,
        unique: true
      },
      match: emailRegExOptional
    },
    isEnable: {
      required: true,
      type: Boolean
    },
    isActivated: {
      required: true,
      type: Boolean
    },
    username: {
      type: String,
      match: usernameRegEx,
      required: true,
      index: {
        unique: true
      }
    },
    hashed_password: {
      type: String,
      required: true
    },
    fullname: {
      // TODO: pattern
      type: String
    },
    permission: {
      type: Number,
      'enum': [permissions.SuperAdmin, permissions.Instructor, permissions.Student, permissions.Guest],
      'default': 0
    },
    salt: {
      type: String,
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
  User.statics.Permissions = permissions;
  /** Permission helpers. */
  User.method('canAccessAdminPanel', function() {
    return this.permission & (1 << 0);
  });
  User.virtual('isGuest').get(function() {
    return this.permission == permissions.Guest;
  });

  /** Login token for remembering logins. */
  LoginToken = new Schema({
    username: {
      type: String,
      match: usernameRegEx,
      required: true,
      index: {
        unique: true
      }
    },
    series: {
      type: String,
      index: true
    },
    token: {
      type: String,
    }
  });
  /** Automatically create the series when this is first created.
   *  Regenerate token every time user visits. */
  LoginToken.pre('save', function(next) {
    if (!this.series) {
      this.series = randomToken();
    }
    this.token = randomToken();
    next();
  });
  // TODO: encrypt cookie
  LoginToken.virtual('cookieValue').get(function() {
    return JSON.stringify({
      username: this.username,
      token: this.token,
      series: this.series
    });
  });

  /** Set up models. */
  mongoose.model('User', User);
  mongoose.model('LoginToken', LoginToken);

  fn();
}

exports.defineModels = defineModels;
exports.emailRegEx = emailRegEx;
exports.usernameRegEx = usernameRegEx;
