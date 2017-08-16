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

User.prototype.toJSON = function () {
  return {
    id: this.id,
    name: this.name,
  };
}

module.exports = User;

User.getByName = function (name, fn) {
  User.getID(name, function (err, id) {
    if (err) return fn(err);
    User.get(id, fn);
  })
}

User.getID = function (name, fn) {
  redisClient.get(`user:id:${name}`, fn);
}

User.get = function (id, fn) {
  redisClient.hgetall(`user:${id}`, function (err, user) {
    if (err) return fn(err);
    fn(null, new User(user));
  })
}

User.authenticate = function (name, pass, fn) {
  User.getByName(name, function (err, user) {
    if (err) return fn(err);
    if (!user.id) return fn();

    bcrypt.hash(pass, user.salt, (err, hash) => {
      if (err) return fn(err);
      if (hash == user.pass) return fn(null, user);
      fn();
    })
  })
}

User.passportAuth = function (name, pass, done) {
  console.log('User.authenticate:' + name);

  return done(null, true);
}

// const newUser = new User({
//   name: 'lisi',
//   pass: '123456',
//   age: 30
// });

// newUser.save(function (err) {
//   if (err) throw err;
//   console.log(newUser);
// })
