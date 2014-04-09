var express = require('express'),
    app = module.exports = express(),
    accountController = require('./controllers/AccountController'),
    recoveryController = require('./controllers/RecoveryPasswordController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Sign In
app.get('/account/signin', function (req, res) {
    res.render('formSignIn', {message: null});
});
app.post('/account/signin', accountController.signin);

// Sign Up
app.get('/account/signup', function (req, res) {
    res.render('formSignUp', {message: null});
});
app.post('/account/signup', accountController.signup);

// Recover Password
app.get('/account/recover', function (req, res) {
    res.render('formRecoverPassword', {message: null});
});
app.post('/account/recover', accountController.recover);
app.put('/account/reset/:id', accountController.reset);
app.get('/account/verify/:token', recoveryController.verify);

// Logout
app.get('/account/logout', function (req, res) {
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
app.put('/account/profile/edit', accountController.profileEdit);

// Delete Account
app.delete('/account/delete/:id', accountController.delete);