var express = require('express'),
    app = module.exports = express(),
    passport = require('passport'),
    controller = require('./controllers/AccountController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Sign In
app.get('/account/signin', function (req, res) {
    res.render('formSignIn', {message: null});
});
app.post('/account/signin', controller.signin);

// Sign Up
app.get('/account/signup', function (req, res) {
    res.render('formSignUp', {message: null});
});
app.post('/account/signup', controller.signup);

// Reset Password
//app.get('/account/resetPassword', function (req, res) {
//    res.render('formResetPassword');
//});
//app.post('/account/resetPassword', controller.find);

// Logout
app.post('/account/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Profile
app.get('/account/profile', function (req, res) {
    if (req.user) {
        res.render('formProfile', {
            user: req.user
        });
    } else {
        res.redirect('/');
    }
});

// Delete Account
app.delete('/account/delete/:id', controller.delete);