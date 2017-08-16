const redis = require('redis');

const redisClient = redis.createClient();

exports.save = (data, fn) => {
  var postJSON = JSON.stringify(data);
  redisClient.lpush('posts', postJSON, (err) => {
    if (err) return fn(err);
    fn();
  });
}

exports.getRange = (from, to, fn) => {
  redisClient.lrange('posts', from, to, (err, items) => {
    if (err) return fn(err);

    var posts = [];
    items.forEach((item) => {
      posts.push(JSON.parse(item));
    });

    fn(null, posts);
  });
}

exports.count = (fn) => {
  redisClient.llen('posts',fn);
}