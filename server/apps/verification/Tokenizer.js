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
					'<strong>Thanks for joining Namist! Please activate your account below:</strong> <br /><br />',
					'<a href="'+ verifyUrl +'" target="_blank">Activate Account</a><br /><br />',
					'Or copy and paste this link into your browser:<br />',
					'<a href="'+ verifyUrl +'" target="_blank">'+ verifyUrl +'</a><br /><br />',
					'If something isn\'t working, please don\'t contact us.<br /><br />',
					'Thanks,<br />The Namist Team<br /><br />'
				].join('');

			mail({
				from: 'namist <noreply@namist.com>',
				to: user.username +' <'+ user.email +'>',
				subject: '[Namist] Activate your Namist account',
				html: mailBody,
			});
		}
	}
};