const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const registerRoute = require('./routes/register');
const routes = require('./routes/index');
const loginRoute = require('./routes/login');
const postRoute = require('./routes/post');
const apiRoute = require('./routes/api');
const user = require('./lib/middleware/user');
const messages = require('./lib/middleware/messages');
const validate = require('./lib/middleware/validate');
const pager = require('./lib/middleware/pager');
const post = require('./lib/post');
const userlib = require('./lib/user');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy({
  usernameField: 'user[name]',
  passwordField: 'user[pass]'
},
  function (username, password, cb) {
    userlib.getByName(username, (err, user) => {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      // if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    })
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  console.log('-----------passport.serializeUser:' + user);
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  userlib.get(id, (err, user) => {
    if (err) { return cb(err); }
    console.log('-----------passport.deserializeUser:' + user);
    cb(null, user);
  })
});

// Create a new Express application.
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  store: new RedisStore({
    url: 'redis://localhost'
  }),
  name: 'sessionid',
  secret: 'shoutbox',
  cookie: { path: '/', maxAge: 3600000 },
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(user);
app.use(messages);

app.all('*', (req, res, next) => {
  console.log(req.session);
  console.log('---------------------------------' + new Date().toLocaleTimeString());
  next();
})

app.get('/', pager(post.count, 5), postRoute.list);
app.get('/post/:page', pager(post.count, 5), postRoute.list);
app.get('/post',
  require('connect-ensure-login').ensureLoggedIn(),
  postRoute.form);
app.post('/post', validate.required('post[title]'), validate.lengthRange('post[title]', 5), postRoute.submit);

app.get('/register', registerRoute.form);
app.post('/register', registerRoute.submit);

app.get('/login', loginRoute.form);
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }));
app.get('/logout', loginRoute.logout);

app.get('/api/post/:page', pager(post.count, 5), apiRoute.posts);

if (process.env.ERROR_ROUTE) {
  app.get('/dev/error', (req, res, next) => {
    var err = new Error('服务器错误');
    // err.type = 'database';
    next(err);
  })
}

app.use(routes.notFound);
app.use(routes.error);

app.listen(3000, () => {
  console.log('server start!');
});
