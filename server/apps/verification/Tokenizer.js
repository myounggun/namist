var TokenModel = require('./VerificationTokenModel');
module.exports = {
	createToken: function(user, done) {
		var verificationToken = new TokenModel({
			'_userId': user._id
		});

		verificationToken.createVerificationToken(function(err, token) {
			if (err) {
				console.log("Couldn't create verification token", err);
				return done(err);
			}

			var message = {
				email: user.email,
				name: user.username
				// ,
				// verifyURL: req.protocol + "://" + req.get('host') + "/verify/" + token
			};

			console.log(message, token);
			done(null, token);

			// console.log(message, token);
			// sendVerificationEmail(message, function (error, success) {
			// 	if (error) {
			// 		// not much point in attempting to send again, so we give up
			// 		// will need to give the user a mechanism to resend verification
			// 		console.error("Unable to send via postmark: " + error.message);
			// 		return;
			// 	}
			// 	console.info("Sent to postmark for delivery")
			// });
		});
	}
};