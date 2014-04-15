var PasswordToken = require('../model/PasswordToken'),
    nodemailer = require('nodemailer'),
    mail = nodemailer.mail;

module.exports = function (req, res) {
    return {
        createToken: function (user, done) {
            var passwordToken = new PasswordToken({'_userId': user._id});

            passwordToken.createPasswordToken(function (err, token) {
                if (err) {
                    return done(err);
                }

                done(null, token);
            });
        },

        sendRecoveryEmail: function (user, token) {
            var verifyUrl = req.protocol + "://" + req.get('host') + "/account/verify/" + token,
                mailBody = [
                    res.__('MAIL_BODY_PASSWORD_1') + '<br /><br />',
                    '<a href="'+ verifyUrl +'" target="_blank">' + res.__('MAIL_BODY_PASSWORD_BUTTON') + '</a><br /><br />',
                    res.__('MAIL_BODY_PASSWORD_2') + '<br />',
                    '<a href="' + verifyUrl + '" target="_blank">' + verifyUrl + '</a><br /><br />',
                    res.__('MAIL_BODY_CALL_ME') + '<br /><br />',
                    res.__('MAIL_BODY_THX') + '<br />' + res.__('MAIL_BODY_TEAM') + '<br /><br />'
                ].join('');

            mail({
                from: 'namist <noreply@namist.com>',
                to: user.username +' <'+ user.email +'>',
                subject: res.__('MAIL_SUBJECT_PASSWORD'),
                html: mailBody
            });
        }
    };
};