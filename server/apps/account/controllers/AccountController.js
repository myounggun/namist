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

//function onFind (req, res) {
//    var username = req.body.username,
//        email = req.body.email;
//
//    Account.findOne({username: username}, function (err, user) {
//        if (err) {
//            console.log(err);
//        }
//
//        if (user) {
//            var o = JSON.parse(JSON.stringify(user)),
//                savedEMail = o.email;
//
//            if (savedEMail === email) {
//                var mailBody = [
//                    '<strong>Your password is</strong> <br /><br />'
//                ].join('');
//
//                mail({
//                    from: 'namist <noreply@namist.com>',
//                    to: username +' <'+ email +'>',
//                    subject: '[Namist] Your namist password',
//                    html: mailBody
//                });
//            } else {
//                // 사용자 정보가 틀릴 때
//                res.send('사용자 정보가 틀립니다.');
//            }
//        } else {
//            // 해당 이름의 사용자가 없을 때
//            res.send('사용자가 없습니다.');
//        }
//    });
//}

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
    var authByToken = Tokenizer(req, res);

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
        return res.json({
            status: 'ok',
            message: "not modified"
        });
    } else {
        for (var key in req.body) {
            update[key] = req.body[key];
        }

        Account.update(conditions, update, updateOptions, function(err, numAffected) {
            if (err) throw err;

            return res.json({
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
//exports.find = onFind;