var app = express(),
    controller = require('./controllers/VerificationController');

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/verify/:token', controller.verify);
app.get('/send/verifytoken', controller.send);

module.exports = app;