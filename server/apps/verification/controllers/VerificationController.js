var VerifyUser = require('../VerifyUser'),
    Tokenizer = require('../Tokenizer.js'),
    tokenModel = require('../VerificationTokenModel');

module.exports = {
    verify: function(req, res, next) {
        var token = req.params.token;

        VerifyUser(token, function(err, user, resText) {
            if (err) {
                console.log(err);
                res.render('verifyFailure', {
                    locals: {
                        "token": token
                    },
                    cache: false
                });
            } else {
                var locals = {
                        "token": token,
                        "account": {
                            "username": user.username,
                            "email": user.local.email
                        }
                    },
                    tplName = 'verify'+ resText; // ['Success', 'Already']

                res.render(tplName, {
                    locals: {
                        "token": token,
                        "account": {
                            "username": user.username,
                            "email": user.local.email
                        }
                    },
                    cache: false
                });
            }
        });
    },

    send: function(req, res, next) {
        var user = req.user,
            authByToken = Tokenizer(req, res);

        if (!user) throw new Error("You not logged in!");
        if (user.authentification) {
            return res.send("You already verified!");
        }

        tokenModel.findOne({ _userId: user._id }, function(err, refToken) {
            if (err) return;

            function resend() {
                authByToken.createToken(user, function(err, token) {
                    if (err) {
                        throw err;
                    }

                    authByToken.sendVerificationEmail(user, token);

                    res.send('Send verification email by token \''+ token +'\'. Complete!');
                });
            }

            if (refToken) {
                tokenModel.remove({
                    _id: refToken._id
                }, function(err, resCode) {
                    if (err) throw err;

                    resend();
                });
            } else {
                resend();
            }
        });
    }
};