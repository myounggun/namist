var express = require('express'),
    app = express(),
    controller = require('./controllers/VerificationController');

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/verify/:token', controller.verify);

module.exports = app;