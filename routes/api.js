const Post = require('../lib/post');

exports.posts = (req, res, next) => {
  var page = req.page;
  Post.getRange(page.from, page.to, (err, posts) => {
    if (err) return next(err);
    
    res.set('Content-Type', 'application/json');
    res.json(posts);
  });
}