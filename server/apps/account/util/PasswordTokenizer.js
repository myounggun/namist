var PasswordToken = require('../model/PasswordToken'),
    nodemailer = require('nodemailer'),
    mail = nodemailer.mail;

module.exports = function (req, res) {
    return {
        createToken: function (user, done) {
            var passwordToken = new PasswordToken({'_userId': user._id});

            passwordToken.createPasswordToken(function (err, token) {
                if (err) {
                    console.log("Couldn't create password token", err);
                    return done(err);
                }

                done(null, token);
            });
        },

        sendRecoveryEmail: function (user, token) {
            var verifyUrl = req.protocol + "://" + req.get('host') + "/account/verify/" + token,
                mailBody = [
                    'To reset your password to sign in to Namist.<br />Please click the link below to complete your new password request:<br /><br />',
                        '<a href="'+ verifyUrl +'" target="_blank">Reset Password</a><br /><br />',
                    'Or copy and paste this link into your browser:<br />',
                        '<a href="'+ verifyUrl +'" target="_blank">'+ verifyUrl +'</a><br /><br />',
                    'If something isn\'t working, please don\'t contact us.<br /><br />',
                    'Thanks,<br />The Namist Team<br /><br />'
                ].join('');

            mail({
                from: 'namist <noreply@namist.com>',
                to: user.username +' <'+ user.email +'>',
                subject: "[Namist] Password Reset Confirmation",
                html: mailBody
            });
        }
    };
};