var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../model/User'),
    ConfigAuth = require('./auth'),
    passport = require('passport'),
    gravatar = require('gravatar');

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
                return done(null, false, req.flash('warning', req.__('FAILURE_NO_USER')));
            }

            if (!user.isValidPassword(password)) {
                return done(null, false, req.flash('warning', req.__('FAILURE_NO_USER')));
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
                    return done(null, false, req.flash('warning', req.__('FAILURE_ALREADY_EMAIL')));
                } else {
                    var username = req.body.username;

                    User.findOne({'username': username}, function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            return done(null, false, req.flash('warning', req.__('FAILURE_ALREADY_USER')));
                        } else {
                            var newUser = new User();

                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.username = username;
                            newUser.avatar = getGravatar(email);

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
            user.avatar = getGravatar(email);

            user.save(function (err) {
                if (err) {
                    throw err;
                }

                return done(null, user);
            });
        }
    }));

    /**
     * Facebook
     */
    passport.use(new FacebookStrategy({
        clientID: ConfigAuth.facebookAuth.clientID,
        clientSecret: ConfigAuth.facebookAuth.clientSecret,
        callbackURL: ConfigAuth.facebookAuth.callbackURL,
        passReqToCallback : true
    }, function (req, token, refreshToken, profile, done) {
        var email;

        if (!req.user) {
            User.findOne({'facebook.id': profile.id}, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    if (!user.facebook.token) {
                        user.facebook.token = token;
                        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        user.facebook.email = profile.emails[0].value;

                        if (!user.avatar) {
                            user.avatar = getFacebookProfilePicture(profile.username);
                        } else {
                            user.avatar = getGravatar(profile.emails[0].value);
                        }

                        user.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, user);
                        });
                    }

                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.username = profile.username;
                    newUser.authentication = true;

                    if (!newUser.avatar) {
                        newUser.avatar = getFacebookProfilePicture(profile.username);
                    } else {
                        user.avatar = getGravatar(profile.emails[0].value);
                    }

                    newUser.local.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err){
                            var msg = err.message;

                            switch (err.name) {
                                case 'MongoError':
                                    if (msg.indexOf('$email') > -1) {
                                        msg = req.__('FAILURE_ALREADY_EMAIL');
                                    } else  if (msg.indexOf('$username') > -1) {
                                        msg = req.__('FAILURE_ALREADY_USER');
                                    } else {
                                        msg = req.__('FAILURE_NOT_AVAILABLE');
                                    }

                                    break;
                            }

                            return done(null, false, req.flash('warning', msg));
                        }
                        else{
                            return done(null, newUser);
                        }
                    });
                }
            });
        } else {
            user.facebook.id = profile.id;
            user.facebook.token = token;
            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = profile.emails[0].value;

            if (!newUser.avatar) {
                newUser.avatar = getFacebookProfilePicture(profile.username);
            } else {
                user.avatar = getGravatar(profile.emails[0].value);
            }

            user.save(function (err) {
                if (err) {
                    throw err;
                }

                return done(null, user);
            });
        }
    }));
};

function getGravatar (email) {
    return gravatar.url(email, {
        s: '100', // Size
        r: 'g', // Rating
        d: 'retro'
    }, true);
}

function getFacebookProfilePicture (username) {
    return 'https://graph.facebook.com/' + username + '/picture?width=100&height=100';
}