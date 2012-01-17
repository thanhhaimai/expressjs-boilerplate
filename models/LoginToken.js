module.exports = function(mongoose, app) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  /** Login token for remembering logins. */
  LoginToken = new Schema({
    username: {
      type: String,
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
  LoginToken.virtual('cookieValue').get(function() {
    return JSON.stringify({
      username: this.username,
      token: this.token,
      series: this.series
    });
  });

  mongoose.model('LoginToken', LoginToken);
  app.LoginToken = mongoose.model('LoginToken');
}
