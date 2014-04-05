var express = require('express'),
    app = module.exports = express(),
    passport = require('passport'),
    controller = require('./controllers/AccountController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Sign In
app.get('/account/signin', function (req, res) {
    res.render('formSignIn');
});
app.post('/account/signin', controller.signin);

// Sign Up
app.get('/account/signup', function (req, res) {
    res.render('formSignUp');
});
app.post('/account/signup', controller.signup);

// Reset Password
app.get('/account/resetPassword', function (req, res) {
    res.render('formResetPassword');
});
app.post('/account/resetPassword', controller.find);

// Logout
app.post('/account/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Profile
app.get('/account/profile', function (req, res) {
    res.render('formProfile', {
        username: req.user.username,
        email: req.user.email,
        id: req.user.id
    });
});

// Delete Account
app.post('/account/delete', function (req, res) {
    controller.delete;
});
