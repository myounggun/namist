var passport = require('passport'),
    Account = require('../Account'),
    Tokenizer = require('../../verification/Tokenizer.js'),
    nodemailer = require('nodemailer'),
    mail = nodemailer.mail;

function onSignIn (req, res) {
    passport.authenticate('local', function (err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
            res.render('formSignIn');
        }

        if (user.authentication) {
            req.logIn(user, function (err) {
                if (err) {
                    throw err;
                }

                res.redirect('/account/profile');
            });
        } else {
            res.redirect('/account/verify');
        }
    })(req, res);
}

function onSignUp (req, res) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password;

    var account = new Account({
        username: username,
        email: email
    });

    Account.register(account, password, function (err, user) {
        if (err) {
            console.log(err);
            res.render('formSignUp');
        }

        sendVerificationEMail(req, res, user);
    });
}

function onFind (req, res) {
    var username = req.body.username,
        email = req.body.email;

    Account.findOne({username: username}, function (err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            var o = JSON.parse(JSON.stringify(user)),
                savedEMail = o.email;

            if (savedEMail === email) {
                var mailBody = [
                    '<strong>Your password is</strong> <br /><br />'
                ].join('');

                mail({
                    from: 'namist <noreply@namist.com>',
                    to: username +' <'+ email +'>',
                    subject: '[Namist] Your namist password',
                    html: mailBody
                });
            } else {
                // 사용자 정보가 틀릴 때
                res.send('사용자 정보가 틀립니다.');
            }
        } else {
            // 해당 이름의 사용자가 없을 때
            res.send('사용자가 없습니다.');
        }
    });
}

function onDelete (req, res) {
    var objectId = req.params.id;

    Account.remove({
        _id: objectId
    }, function (err, resCode) {
        if (err) {
            throw err;
        }

        if (resCode) {
            res.write({code: 'S'});
            res.end();
        } else {
            res.write({code: 'E'});
            res.end();
        }
    })
}

function sendVerificationEMail (req, res, user) {
    var authByToken = Tokenizer(req, res);

    authByToken.createToken(user, function (err, token) {
        if (err) {
            throw err;
        }

        console.log(token);
        authByToken.sendVerificationEmail(user, token);

        passport.authenticate('local')(req, res, function () {
            res.send('Send verification email by token \''+ token +'\'. Complete!');
        });
    });
}

exports.signup = onSignUp;
exports.signin = onSignIn;
exports.delete = onDelete;
exports.find = onFind;