var LocalStrategy = require('passport-local').Strategy,
    User = require('../model/User'),
    passport = require('passport'),
    i18n = require('i18n');

module.exports = function () {
    /**
     * 패스포트 세션 설정
     */
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    /**
     * 로컬 - 로그인
     */
    passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('warning', i18n.__('FAILURE_NO_USER')));
            }

            if (!user.isValidPassword(password)) {
                return done(null, false, req.flash('warning', i18n.__('FAILURE_NO_USER')));
            }

            return done(null, user);
        });
    }));

    /**
     * 로컬 - 회원 가입
     */
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        if (!req.user) {
            User.findOne({'local.email': email}, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, false, req.flash('warning', 'That email is already taken.'));
                } else {
                    var username = req.body.username;

                    User.findOne({'username': username}, function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            return done(null, false, req.flash('warning', 'That username is already taken.'));
                        } else {
                            var newUser = new User();

                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.username = username;

                            newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }

                                return done(null, newUser);
                            });
                        }
                    });
                }
            });
        } else {
            var user = req.user;

            user.local.email = email;
            user.local.password = user.generateHash(password);
            user.username = req.body.username;

            user.save(function (err) {
                if (err) {
                    throw err;
                }

                return done(null, user);
            });
        }
    }));
};