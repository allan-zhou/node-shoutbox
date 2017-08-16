const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const register = require('./routes/register');
const login = require('./routes/login');
const post = require('./routes/post');
const user = require('./lib/middleware/user');
const messages = require('./lib/middleware/messages');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  name:'sessionid',
  secret: 'shoutbox',
  cookie: { path: '/', maxAge: 3600000 }
}));
app.use(user);
app.use(messages);

app.all('*',(req, res, next) => {
  console.log(`req.method:${req.method}  req.url:${req.url}`);
  console.log(req.session);
  next();
})

app.get('/', post.list);
app.get('/post', post.form);
app.post('/post', post.submit);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.listen(3000);
