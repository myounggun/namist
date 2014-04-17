
/**
 * Module dependencies.
 */

var express		  = require('express')
  , routes		  = require('./routes')
  , http		  = require('http')
  , path		  = require('path')
  , mongoose	  = require('mongoose')
  , autoIncrement = require('mongoose-auto-increment')
  , engine        = require('ejs-locals')
  , flash         = require('express-flash')
  , globalLocals  = require('./modules/global-locals')
  , i18n          = require('i18n');

var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;

var MONGO_URI = 'mongodb://namist:mapfe@58.229.6.204:27017/namist';
mongoose.connect(MONGO_URI);

var db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', function (msg) {
	console.log(msg);
});

db.on('open', function () {
	console.log('database connected');
});

var app = express();

i18n.configure({
    locales: ['ko', 'en'],
    directory: path.join(__dirname, '/apps/locales'),
    defaultLocale: 'en',
    cookie: 'locale'
});

// all environments

var port = process.env.PORT || 3000,
  env = process.env.NODE_ENV || "development";

var bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  methodOverride = require('method-override'),
  session = require('express-session');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(globalLocals({
  appname: "제목학원",
  title: "",
  user: null
}));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('namist'));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '../client')));

routes(app);

app.use(session({cookie: {maxAge:60000}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n.init);
// app.use(app.router);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


var Account = require('./apps/account/model/Account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// development only
if ('development' == env) {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      // res.render('error', {
      //     message: err.message,
      //     error: err
      // });
  });
}

app.post('/upload', function(req, res){

	console.log("uploadfile");
	res.end();

});


app.set('port', port);

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
});