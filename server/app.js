
/**
 * Module dependencies.
 */

var express		  = require('express')
  , routes		  = require('./routes')
  , http		  = require('http')
  , path		  = require('path')
  , mongoose	  = require('mongoose')
  , autoIncrement = require('mongoose-auto-increment')
  , engine = require('ejs-locals');

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


// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('namist'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

routes(app);

var Account = require('./apps/account/Account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/upload', function(req, res){

	console.log("uploadfile");
	res.end();

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
