var async = require('async'),
    User = require('../model/User'),
    CertificationTokenizer = require('../../verification/Tokenizer.js'),
    PasswordTokenizer = require('../util/PasswordTokenizer.js');

module.exports = {
    processSignUp: function (req, res, next) {
        if (!req.isAuthenticated()) {
            var err = new Error();
            err.status = 400;

            return next(err);
        }

        var user = req.user,
            authByToken = CertificationTokenizer(req, res);

        authByToken.createToken(user, function (err, token) {
            if (err) {
                return next(err);
            }

            authByToken.sendVerificationEmail(user, token);
            res.redirect('/');
        });
    },
    processSignIn: function (req, res, next) {
        if (!req.isAuthenticated()) {
            var err = new Error();
            err.status = 400;

            return next(err);
        }

        var user = req.user;

        if (user.authentication) {
            res.redirect('/');
        } else {
            res.redirect('/account/profile');
        }
    },
    processRequestPasswordRecovery: function (req, res, next) {
        var email = req.body.email,
            username = req.body.username;

        async.waterfall([
            function (cb) {
                User.findOne({'local.email': email}, function (err, user) {
                    if (err) {
                        return cb(err);
                    }

                    if (!user || (username !== user.username )) {
                        req.flash('warning', res.__('FAILURE_NO_USER'));
                        return res.render('formRecoverPassword');
                    }

                    cb(null, user);
                });
            },
            function (user, cb) {
                var passwordToken = new PasswordTokenizer(req, res);

                passwordToken.createToken(user, function (err, token) {
                    if (err) {
                        return cb(err);
                    }

                    passwordToken.sendRecoveryEmail(user, token);
                    cb(null, user);
                });
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.redirect('/');
        });
    },
    processResetPassword: function (req, res, next) {
        var password = req.body.password,
            confirm = req.body.confirm;

        User.findById(req.params.id, function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                var err = new Error();
                err.status = 400;

                return next(err);
            }

            user.local.password = user.generateHash(confirm);

            user.save(function (err) {
                if (err) {
                    return next(err);
                }

                res.redirect('/account/signin');
            });
        });
    },
    processDeleteUser: function (req, res, next) {
        if (!req.isAuthenticated()) {
            var err = new Error();
            err.status = 400;

            return next(err);
        }

        User.remove({_id: req.params.id}, function (err, resCode) {
            if (err) {
                return next(err);
            }

            if (resCode) {
                req.logout();
                res.redirect('/');
            } else {
                req.flash('warning', res.__('FAILURE_UNLINK_ACCOUNT'));
                res.render('formProfile');
            }
        });
    },
    processEdit: function (req, res, next) {
        var user = req.user,
            update = {authentication: false};

        if (Object.keys(req.body).length === 0) {
            return;
        }

        for (var key in req.body) {
            update[key] = req.body[key];
        }

        User.update({_id: user._id}, update, {multi: true}, function (err, numAffected) {
            if (err) {
                var msg = err.message;

                switch (err.name) {
                    case 'MongoError':
                        if (msg.indexOf('$email') > -1) {
                            msg = res.__('FAILURE_ALREADY_EMAIL');
                        } else  if (msg.indexOf('$username') > -1) {
                            msg = res.__('FAILURE_ALREADY_USER');
                        } else {
                            msg = res.__('FAILURE_NOT_AVAILABLE');
                        }

                        break;
                }

                if (msg) {
                    return res.json({
                        status: 'error',
                        message: res.__(msg)
                    });
                } else {
                    return next(err);
                }
            }

            res.json({
                status: 'ok',
                message: numAffected + ' field(s) modified.'
            });
        });
    }
};