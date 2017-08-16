const User = require('../user');

module.exports = (req, res, next) => {
  var sess = req.session;
  
  if (!sess.passport) return next();

  User.get(sess.passport.user, (err, user) => {
    if(err) return next(err);

    req.user = res.locals.user = user;
    next();
  })
} 