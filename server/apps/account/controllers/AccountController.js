var passport = require('passport'),
    Account = require('../model/Account'),
    CertificationTokenizer = require('../../verification/Tokenizer.js'),
    PasswordTokenizer = require('../util/PasswordTokenizer.js');

function onSignIn (req, res) {
    passport.authenticate('local', function (err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
            return res.render('formSignIn', {
                message: "Sorry, we didn't recognize your sign-in details. Please check your user name and password, then try again."
            });
        }

        req.logIn(user, function (err) {
            if (err) {
                throw err;
            }

            if (user.authentication) {
                res.redirect('/');
            } else {
                res.redirect('/account/profile');
            }
        });
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
            var message = '';

            switch (err.name) {
                case 'BadRequestError':
                    message = err.message;
                    break;
                case 'MongoError':
                    if (err.code == 11000) {
                        message = 'User already exists with email';
                    }
                    break;
            }

            return res.render('formSignUp', {message: message});
        }

        sendVerificationEMail(req, res, user);
    });
}

function onRecover (req, res) {
    var username = req.body.username,
        email = req.body.email;

    Account.findOne({username: username}, function (err, user) {
        if (err) {
            throw err;
        }

        if (!user || (email !== user.email)) {
            return res.render('formRecoverPassword', {
                message: "Sorry, we didn't recognize your sign-in details. Please check your user name and email, then try again."
            });
        }

        var passwordToken = PasswordTokenizer(req, res);

        passwordToken.createToken(user, function (err, token) {
            if (err) {
                throw err;
            }

            passwordToken.sendRecoveryEmail(user, token);

            res.redirect('/');
        });
    });
}

function onReset (req, res) {
    var userId = req.params.id,
        password = req.body.password,
        confirm = req.body.confirm;

    if (!password || !confirm) {
        res.render('formNewPassword', {message: 'Required your password.'});
    }

    if (password !== confirm) {
        res.render('formNewPassword', {message: 'Passwords do not match.'});
    }

    Account.findOne({_id: userId}, function (err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
            return res.render('formNewPassword', {
                message: "Bad Access"
            });
        }

        user.setPassword(confirm, function (err) {
            if (err) {
                throw err;
            }

            user.save(function (err) {
                if (err) {
                    throw err;
                }

                res.redirect('/account/signin');
            });
        });
    });
}

function onDelete (req, res) {
    var id = req.params.id;

    console.log(id);

    Account.remove({
        _id: id
    }, function (err, resCode) {
        if (err) {
            throw err;
        }

        if (resCode) {
            req.logout();
            res.redirect('/');
        } else {
            console.log('삭제를 실패했습니다.');
        }
    })
}

function sendVerificationEMail (req, res, user) {
    var authByToken = CertificationTokenizer(req, res);

    authByToken.createToken(user, function (err, token) {
        if (err) {
            throw err;
        }

        authByToken.sendVerificationEmail(user, token);

        passport.authenticate('local')(req, res, function () {
            res.send('Send verification email by token \''+ token +'\'. Complete!');
        });
    });
}

function onProfileEdit(req, res) {
    var user = req.user;

    if (!user) {
        return res.json({
            status: "error",
            message: "bad access."
        });
    }

    var conditions = {
            _id: user._id
        },
        update = {
            authentication: false
        },
        updateOptions = {
            multi: true
        };

    if (Object.keys(req.body).length === 0) {
        res.json({
            status: 'ok',
            message: "not modified"
        });
    } else {
        for (var key in req.body) {
            update[key] = req.body[key];
        }

        Account.update(conditions, update, updateOptions, function(err, numAffected) {
            if (err) {
                var message = err.message;

                switch (err.name) {
                    case 'MongoError':
                        if (message.indexOf("$email") > -1) {
                            message = '중복된 email이 있습니다.';
                        } else if (message.indexOf("$username") > -1) {
                            message = '중복된 username이 있습니다.';
                        } else {
                            message = "알수없는 오류";
                        }

                        break;
                }

                return res.json({
                    status: "error",
                    message: message
                });
            }

            res.json({
                status: 'ok',
                message: numAffected +" field(s) modified."
            });
        });
    }
}

exports.signup = onSignUp;
exports.signin = onSignIn;
exports.delete = onDelete;
exports.profileEdit = onProfileEdit;
exports.recover = onRecover;
exports.reset = onReset;