import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoSanitize from 'express-mongo-sanitize';
const app = express();
const server = require('http').Server(app);
const MongoDBStore = require('connect-mongodb-session')(session);

app.use(logger('dev'));
app.use(favicon(`${__dirname}/../client/favicon.ico`));

const store = new MongoDBStore({uri: 'mongodb://localhost/twilio2fawebtest_db', collection: 'mySessions'});
app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secure: false
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Midlleware to sanitize all body, params & queries in req
app.use(mongoSanitize({
  replaceWith: '_'
}))

app.use(cookieParser());

//security middleware
function secureInjector(req, res, next) {
  if (req.session.loggedIn) {
    next();
  }else {
    res.redirect("/login?messg=login%20is%20required");
  }
}
function highSecureInjector(req, res, next) {
  console.log(req.originalUrl);
  req.session.startingPoint = req.originalUrl;
  if (req.session.loggedIn && req.session.authy) {
    next();
  } else if (req.session.loggedIn && !req.session.authy) {
    res.redirect("/2fa");
  } else {
    res.redirect("/login?messg=login%20is%20required");
  }
}

app.use('/2fa/*', secureInjector);
app.use('/api/2fa/*', secureInjector);

//easy redirects

app.use('/logout', (req, res) => {
  res.redirect('/api/user/logout');
});
app.use('/continue', (req, res) => {
  res.redirect('/api/continue');
});


//go in if already logged in
app.use('/login', (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/continue');
  }
  else{
    next();
  }
});
app.use('/register', (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/continue');
  }
  else{
    next();
  }
});


import apiRouter from './routes/api/'
app.use('/api/', apiRouter);

import secureRouter from './routes/secure/'
app.use('/secure/', highSecureInjector, secureRouter);

app.use('/', express.static(path.join(__dirname, '../client')));

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err)
    res.json({message: err.message, error: err});
  });
}

// production error handler no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({message: err.message, error: {}});
});

export default server;
