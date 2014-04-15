var express = require('express'),
    app = module.exports = express(),
    accountController = require('./controllers/AccountController'),
    recoveryController = require('./controllers/RecoveryPasswordController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Sign In
app.get('/account/signin', function (req, res) {
    res.render('formSignIn');
});
app.post('/account/signin', accountController.signin);

// Sign Up
app.get('/account/signup', function (req, res) {
    res.render('formSignUp');
});
app.post('/account/signup', accountController.signup);

// Recover Password
app.get('/account/recover', function (req, res) {
    res.render('formRecoverPassword');
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

//for facebook Account
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    FBController = require('./controllers/FbAccountController'),
    Account = require('./model/Account');

passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    Account.findById(id, function(err, user){
        done(err, user);
    });
});
passport.use(new FacebookStrategy(FBController.appConfig, FBController.onResponseFromFB));

app.get('/account/facebook', passport.authenticate('facebook', { scope: ['email']})); //, 'read_stream', 'publish_actions'
app.get('/account/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : '/account/signin'
}));