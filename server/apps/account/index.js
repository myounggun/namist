var express = require('express'),
    app = module.exports = express(),
    passport = require('passport'),
    accountController = require('./controllers/AccountController'),
    recoveryController = require('./controllers/RecoveryPasswordController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/account/signup', function (req, res) {
    res.render('formSignUp');
});
app.post('/account/signup', passport.authenticate('local-signup', {
    failureRedirect: '/account/signup',
    failureFlash: true
}), accountController.processSignUp);

app.get('/account/signin', function (req, res) {
    res.render('formSignIn');
});
app.post('/account/signin', passport.authenticate('local-signin', {
    failureRedirect: '/account/signin',
    failureFlash: true
}), accountController.processSignIn);

app.get('/account/recover', function (req, res) {
    res.render('formRecoverPassword');
});
app.post('/account/recover', accountController.processRequestPasswordRecovery);
app.put('/account/reset/:id', accountController.processResetPassword);
app.get('/account/verify/:token', recoveryController.verify);

app.get('/account/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/account/profile', isLoggedIn, function (req, res) {
    res.render('formProfile', {
        user: req.user
    });
});
app.put('/account/profile/edit', isLoggedIn, accountController.processEdit);
app.delete('/account/delete/:id', isLoggedIn, accountController.processDeleteUser);

////for facebook Account
//var passport = require('passport'),
//    FacebookStrategy = require('passport-facebook').Strategy,
//    FBController = require('./controllers/FbAccountController'),
//    Account = require('./model/Account');
//
//passport.serializeUser(function(user, done){
//    done(null, user.id);
//});
//passport.deserializeUser(function(id, done){
//    Account.findById(id, function(err, user){
//        done(err, user);
//    });
//});
//passport.use(new FacebookStrategy(FBController.appConfig, FBController.onResponseFromFB));
//
//app.get('/account/facebook', passport.authenticate('facebook', { scope: ['email']})); //, 'read_stream', 'publish_actions'
//app.get('/account/facebook/callback', passport.authenticate('facebook', {
//    successRedirect : '/',
//    failureRedirect : '/account/signin'
//}));

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}