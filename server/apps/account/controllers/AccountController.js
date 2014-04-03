var passport = require('passport'),
    Account = require('../Account'),
    Tokenizer = require('../../verification/Tokenizer.js');

function onSignUp (req, res) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password;

    var account = new Account({
        username: username,
        email: email
    });

    Account.register(account, password, function (err, account) {
        if (err) {
            console.log(err);
            res.render('formSignUp', {account: account});
        }

        var authByToken = Tokenizer(req, res);

        authByToken.createToken(account, function(err, token) {
            if (err) throw err;

            authByToken.sendVerificationEmail(account, token);

            passport.authenticate('local')(req, res, function () {
                res.send('Send verification email by token \''+ token +'\'. Complete!');
            });
        });
    });
}

function onSignIn (req, res) {
    // Todo: 로그인 과정을 마치면 사용자 정보를 홈으로 전달
    res.redirect('/');
}

exports.signup = onSignUp;
exports.signin = onSignIn;
