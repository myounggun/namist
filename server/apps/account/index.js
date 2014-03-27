var express = require('express'),
    app = module.exports = express(),
    passport = require('passport'),
    controller = require('./controllers/AccountController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Show the login form
app.get('/signin', function (req, res) {
    res.render('formSignIn');
});

// Process the login form
app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin'
}), controller.signin);

// Show the sign up form
app.get('/signup', function (req, res) {
    res.render('formSignUp');
});

// Process the sign up form
app.post('/signup', controller.signup);