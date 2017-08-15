module.exports = (req, res, next) => {
  res.locals.messages = req.session.messages || [];
  res.locals.removeMessages = () => {
    req.session.messages = [];
  };
  next();
}