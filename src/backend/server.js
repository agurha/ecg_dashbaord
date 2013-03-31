/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 31/03/2013
 * Time: 10:28
 * To change this template use File | Settings | File Templates.
 */

var config = require('config')
var http = require("http")
var express = require("express")
var redisStore = require("connect-redis")(express)
var path = require("path")
var apiClient = require("./services/apiClient").api
var logger = require("./services/loggerService").logger
var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var flash = require('connect-flash');
var _ = require('lodash')


process.on('uncaughtException', function (err) {
  logger.error('Caught exception: ' + err);
  logger.error(err);
});

logErrors = function(err, req, res, next) {
  logger.error('Error: ' + err);
  logger.error(err);
  return next(err);
};

clientErrorHandler = function(err, req, res, next) {
  if (req.xhr) {
    res.send(500, {
      error: 'client error: ' + err
    });
    return logger.error(err);
  } else {
    return next(err);
  }
};

errorHandler = function(err, req, res, next) {
  res.status(500);
  return res.render('error', {
    error: err
  });
};


passport.serializeUser(function (user, done) {
  logger.info('serializing user : ' + user._id);

  done(null, user._id);

});

passport.deserializeUser(function (id, done) {

  logger.info('deserializing user :' + id);

  apiClient.get('/user' + id, function (err, user) {
    if (err) {
      logger.error(err);
      done(err, false);
    }
    else
      done(null, user);
  });
});

passport.user(new LocalStrategy(function (email, password, done) {

  logger.info('authenticating user with email :' + email);

  apiClient.post('/user/signin', {

    email: email,
    password: password
  }, function (err, req, res, user) {

    if (err) {
      logger.error(err.message);
      done(err, false);
    }
    else
      done(null, user);
  });
}));

var app = module.exports = express();

app.configure(function() {
  app.use(express.favicon(__dirname + './public/img/favicon.ico'));
  app.use(express["static"](path.join(__dirname, '../../dist')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(flash());
  app.sessionStore = new redisStore({
    host: config.redis.host,
    port: config.redis.port,
    pass: config.redis.password,
    prefix: config.redis.prefix
  });
  console.log('connecting redis as session store: ' + app.sessionStore);
  app.use(express.session({
    store: app.sessionStore,
    secret: config.redis.secret,
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
  app.set("views", path.join(__dirname, "views"));
  app.set("view options", {
    layout: true
  });
  app.set("view engine", "jade");
  return app.enable("view cache");
});

app.configure("production", function() {
  return app.use(express.compress());
});

app.configure("development", function() {
  return app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

var commonRouter = require('./routes/commonRouter');
var accountRouter = require('./routes/accountRouter');

app.get('/', commonRouter.home);
app.get('/about', commonRouter.about);
app.get('/blog', commonRouter.blog);
app.get('/terms', commonRouter.terms);
app.get('/docs', commonRouter.docs);





