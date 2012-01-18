var nodemailer = require('nodemailer');

/** Generic mailer .*/
function sendMail(mail, next) {
  nodemailer.send_mail(mail, function(err, success) {
    if(err) {
      log(err);
      next(new Error("wrong smtp information"));
      return;
    }
    if(success) {
      next();
    } else {
      next(new Error("smtp server downs, or refuse to take our email."));
    }
  });
}

/** Flash message support. */
module.exports = function(app) {
  if (app.config.enableSMTP) {
    nodemailer.SMTP = app.config.SMTP;
    app.sendMail = sendMail;
  }
};