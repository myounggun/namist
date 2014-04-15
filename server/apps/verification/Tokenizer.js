var TokenModel = require('./VerificationTokenModel'),
	nodemailer = require('nodemailer'),
	mail = nodemailer.mail;

module.exports = function(req, res) {
	return {
		createToken: function(user, done) {
			var verificationToken = new TokenModel({
				'_userId': user._id
			});

			verificationToken.createVerificationToken(function(err, token) {
				if (err) {
					console.log("Couldn't create verification token", err);
					return done(err);
				}


				done(null, token);
			});
		},

		sendVerificationEmail: function(user, token) {
			var verifyUrl = req.protocol + "://" + req.get('host') + "/verify/" + token,
				mailBody = [
                    res.__('MAIL_BODY_VERIFICATION_1') + '<br /><br />',
                    '<a href="'+ verifyUrl +'" target="_blank">' + res.__('MAIL_BODY_VERIFICATION_BUTTON') + '</a><br /><br />',
                    res.__('MAIL_BODY_VERIFICATION_2') + '<br />',
                    '<a href="' + verifyUrl + '" target="_blank">' + verifyUrl + '</a><br /><br />',
                    res.__('MAIL_BODY_CALL_ME') + '<br /><br />',
                    res.__('MAIL_BODY_THX') + '<br />' + res.__('MAIL_BODY_TEAM') + '<br /><br />'
				].join('');

			mail({
				from: 'namist <noreply@namist.com>',
				to: user.username +' <'+ user.email +'>',
				subject: res.__('MAIL_SUBJECT_VERIFICATION'),
				html: mailBody,
			});
		}
	}
};