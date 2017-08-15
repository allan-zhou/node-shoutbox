const redis = require('redis');
const bcrypt = require('bcrypt');

const redisClient = redis.createClient();

function User(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      this[key] = obj[key];
    }
  }
}

User.prototype.save = function (fn) {
  if (this.id) {
    this.update(fn);
  } else {
    var user = this;
    redisClient.incr('user:ids', function (err, id) {
      if (err) return fn(err);
      user.id = id;
      user.hashPassword(function (err) {
        if (err) return fn(err);
        user.update(fn);
      })
    })
  }
}

User.prototype.update = function (fn) {
  var user = this;
  var id = user.id;
  redisClient.set(`user:id:${user.name}`, id, function (err) {
    if (err) return fn(err);
    redisClient.hmset(`user:${id}`, user, function (err) {
      fn(err);
    })
  });
}

User.prototype.hashPassword = function (fn) {
  var user = this;
  bcrypt.genSalt(12, function (err, salt) {
    if (err) return fn(err);
    user.salt = salt;
    bcrypt.hash(user.pass, salt, function (err, hash) {
      if (err) return fn(err);
      user.pass = hash;
      fn();
    })
  })
}

module.exports = User;

// const newUser = new User({
//   name: 'lisi',
//   pass: '123456',
//   age: 30
// });

// newUser.save(function (err) {
//   if (err) throw err;
//   console.log(newUser);
// })
