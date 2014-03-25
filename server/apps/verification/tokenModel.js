/**
 *
 */
var mongoose	= require('mongoose'),
	Schema		= mongoose.Schema,
	uuid = require('node-uuid');
	// ,
	// passport	= require('passport-local-mongoose');

var tokenScheme = new Schema({
    _userId: {type: ObjectId, required: true, ref: 'Account'},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
});


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

var tokenModel = mongoose.model('VerificationToken', tokenScheme);
module.exports.verificationTokenModel = tokenModel;