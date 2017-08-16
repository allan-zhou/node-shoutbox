const User = require('../lib/user');
const Messages = require('../lib/messages');
const Post = require('../lib/post');

exports.form = (req, res, next) => {
  res.render('post', { title: 'Entry' });
}

exports.submit = (req, res, next) => {
  var data = req.body.post;

  var post = {
    username: res.locals.user.name,
    title: data.title,
    body: data.body
  };

  Post.save(post, (err) => {
    if (err) return next(err);
    res.redirect('/');
  });
}

exports.list = (req, res, next) => {
  Post.getRange(0, -1, (err, posts) => {
    if (err) return next(err);
    res.render('index', {
      title: 'Post',
      data: posts
    });
  });
}