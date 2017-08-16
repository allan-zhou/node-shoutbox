const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const postRoute = require('./routes/post');
const user = require('./lib/middleware/user');
const post = require('./lib/post');
const messages = require('./lib/middleware/messages');
const validate = require('./lib/middleware/validate');
const pager = require('./lib/middleware/pager');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  name: 'sessionid',
  secret: 'shoutbox',
  cookie: { path: '/', maxAge: 3600000 }
}));
app.use(user);
app.use(messages);

app.all('*', (req, res, next) => {
  console.log(`req.method:${req.method}  req.url:${req.url}`);
  console.log(req.session);
  next();
})

app.get('/', pager(post.count, 5), postRoute.list);
app.get('/post', postRoute.form);
app.post('/post', validate.required('post[title]'), validate.lengthRange('post[title]', 5), postRoute.submit);

app.get('/register', registerRoute.form);
app.post('/register', registerRoute.submit);

app.get('/login', loginRoute.form);
app.post('/login', loginRoute.submit);
app.get('/logout', loginRoute.logout);

app.listen(3000);
