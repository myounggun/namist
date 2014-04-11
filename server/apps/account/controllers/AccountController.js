var async = require('async'),
    passport = require('passport'),
    Account = require('../model/Account'),
    CertificationTokenizer = require('../../verification/Tokenizer.js'),
    PasswordTokenizer = require('../util/PasswordTokenizer.js'),
    ErrorHandling = require('../util/MongoDBErrorHandler.js');

function onSignIn (req, res) {
    async.waterfall([
        function (cb) {
            passport.authenticate('local', function (err, user) {
                if (err) {
                    cb(err);
                }

                if (!user) {
                    return cb(CustomError("Sorry, we didn't recognize your sign-in details. Please check your user name and password, then try again"));
                }

                cb(null, user);
            })(req, res);
        },
        function (user, cb) {
            req.logIn(user, function (err) {
                if (err) {
                    cb(err);
                }

                cb(null, user);
            });
        }
    ], function (err, result) {
        if (err) {
            return throwError(req, res, err, 'formSignIn');
        }

        if (result.authentication) {
            res.redirect('/');
        } else {
            res.redirect('/account/profile');
        }
    });
}

function onSignUp (req, res) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password;

    async.waterfall([
        function (cb) {
            Account.register(new Account({
                username: username,
                email: email
            }), password, cb);
        },
        function (user, cb) {
            var authByToken = CertificationTokenizer(req, res);

            authByToken.createToken(user, function (err, token) {
                if (err) {
                    cb(err);
                }

                cb(null, user, authByToken, token);
            });
        },
        function (user, authByToken, token, cb) {
            authByToken.sendVerificationEmail(user, token);
            passport.authenticate('local')(req, res, function () {
                res.send('Send verification email by token \''+ token +'\'. Complete!');
                cb(null, user);
            });
        }
    ], function (err, result) {
        var msg = ErrorHandling(err);

        if (msg) {
            req.flash('warning', msg);
            res.render('formSignUp');
        } else {
            throw err;
        }
    });
}

function onRecover (req, res) {
    var username = req.body.username,
        email = req.body.email;

    async.waterfall([
        function (cb) {
            Account.findOne({username: username}, function (err, user) {
                if (err) {
                    throw err;
                }

                if (!user || (email !== user.email)) {
                    return cb(CustomError("Sorry, we didn't recognize your recovery details. Please check your user name and email, then try again"));
                }

                cb(null, user);
            });
        },
        function (user, cb) {
            var passwordToken = PasswordTokenizer(req, res);

            passwordToken.createToken(user, function (err, token) {
                if (err) {
                    cb(err);
                }

                cb(null, user, passwordToken, token);
            });
        },
        function (user, passwordToken, token, cb) {
            passwordToken.sendRecoveryEmail(user, token);
            cb(null);
        }
    ], function (err, result) {
        if (err) {
            return throwError(req, res, err, 'formRecoverPassword');
        }

        res.redirect('/');
    });
}

function onReset (req, res) {
    var id = req.params.id,
        password = req.body.password,
        confirm = req.body.confirm;

    async.waterfall([
        function (cb) {
            Account.findOne({_id: id}, function (err, user) {
                if (err) {
                    cb(err);
                }

                if (!user) {
                    return cb(CustomError('Access to Namist has been denied'));
                }

                cb(null, user);
            });
        },
        function (user, cb) {
            user.setPassword(confirm, cb);
        },
        function (user, cb) {
            user.save(function (err) {
                if (err) {
                    cb(err);
                }

                cb(null);
            });
        }
    ], function (err, result) {
        if (err) {
            return throwError(req, res, err, 'formNewPassword');
        }

        res.redirect('/account/signin');
    });
}

function onDelete (req, res) {
    Account.remove({_id: req.params.id}, function (err, resCode) {
        if (err) {
            throw err;
        }

        if (resCode) {
            req.logout();
            res.redirect('/');
        } else {
            req.flash('warning', 'Failed to unlink account');
            res.render('formProfile');
        }
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

function CustomError (message) {
    var err = new Error(message);
    err.name = 'CustomError';

    return err;
}

function throwError (req, res, err, renderTarget) {
    if (err.name === 'CustomError') {
        req.flash('warning', err.message);
        return res.render(renderTarget);
    }

    throw err;
}

exports.signup = onSignUp;
exports.signin = onSignIn;
exports.delete = onDelete;
exports.profileEdit = onProfileEdit;
exports.recover = onRecover;
exports.reset = onReset;