const basicAuth = require('basic-auth');
const passport = require('passport');
const Post = require('../lib/post');
const User = require('../lib/user');

exports.auth = (req, res, next) => {
  next();
}

exports.posts = (req, res, next) => {
  var page = req.page;
  Post.getRange(page.from, page.to, (err, posts) => {
    if (err) return next(err);
    res.json(posts);
  });
}