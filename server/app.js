
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
  , i18n          = require('i18n')
  , passport	  = require('passport');

var MONGO_URI = 'mongodb://namist:mapfe@58.229.6.204:27017/namist';
mongoose.connect(MONGO_URI);

require('./apps/account/config/passport')(passport);

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

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(globalLocals({
    appname: "제목학원",
    title: "",
    user: null
}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.cookieParser('namist'));
app.use(express.session({cookie: {maxAge:60000}}));

i18n.configure({
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    cookie: 'namist',
    directory: path.join(__dirname, '/apps/locales'),
    updateFiles: false
});

app.use(i18n.init);

app.use(function (req, res, next) {
    req.__ = function () {
        return i18n.__.apply(res, arguments);
    };
    next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

routes(app);

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