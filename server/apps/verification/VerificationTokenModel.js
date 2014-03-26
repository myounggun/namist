var mongoose	= require('mongoose'),
	uuid = require('node-uuid'),
    tokenScheme = require('./TokenScheme.js');

tokenScheme.methods.createVerificationToken = function (done) {
    var verificationToken = this,
    	token = uuid.v4();

    verificationToken.set('token', token);
    verificationToken.save( function (err) {
        if (err) return done(err);

        return done(null, token);
        console.log("Verification token", verificationToken);
    });
};

module.exports = mongoose.model('VerificationToken', tokenScheme);
