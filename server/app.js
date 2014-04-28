// common modules
global.express = require('express');

var path = require('path'),
    passport = require('passport');

// mongoose
var mongoose = require('mongoose'),
    MONGO_URI = 'mongodb://namist:mapfe@58.229.6.204:27017/namist',
    autoIncremental = require('mongoose-auto-increment'),
    db;


mongoose.connect(MONGO_URI);

db = mongoose.connection;
autoIncremental.initialize(db);

db.on('error', function (msg) {
    console.log(msg);
});

db.on('open', function () {
    console.log('database connected');
});

// passport
require('./apps/account/config/passport')(passport);

// i18n
var i18n = require('i18n');
i18n.configure({
    locales: ['ko', 'en'],
    directory: path.join(__dirname, '/apps/locales'),
    defaultLocale: 'en',
    cookie: 'locale',
    updateFiles: false
});

// express
var app = express(),
    port = process.env.PORT || 3000,
    env = process.env.NODE_ENV || "development",
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('express-flash'),
    layoutEngine = require('ejs-locals'),
    globalLocals = require('./modules/global-locals'),
    routes = require('./routes'),
    less = require('less-middleware');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', layoutEngine);
app.use(globalLocals({
    messages: null,
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
app.use(less(
    path.join(__dirname, 'apps', 'less'),
    {
        dest: path.join(__dirname, '../client'),
        preprocess: {
            path: function (pathname, req) {
                return pathname.replace('/stylesheets', '');
            }
        },
        once: true
    }
));
app.use(express.static(path.join(__dirname, '../client')));

app.use(session({cookie: {maxAge:60000}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n.init);
app.use(function (req, res, next) {
    req.__ = function () {
        return i18n.__.apply(res, arguments);
    };

    next();
});

routes(app);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development only
if ('development' == env) {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
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
