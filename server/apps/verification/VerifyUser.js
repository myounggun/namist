var tokenModel = require('./VerificationTokenModel');

module.exports = function(token, done) {
    tokenModel.findOne({token: token}, function (err, refToken){
        if (err) return done(err, null, 'Error');

        console.log(refToken);

        if (!refToken) return done(new Error('unrecognized token!'), null, 'NoToken');

        var Account = require('../account/model/Account');

        Account.findOne({
            _id: refToken._userId
        }, function(err, user) {
            if (err) return done(err, null, 'NoAccount');

            if (refToken.verified) {
                return done(null, user, 'Already');
            } else {
                refToken['verified'] = true;
                refToken.save(function(err) {
                    if (err) throw err;

                    console.log('token updated');

                    user['authentication'] = true;
                    user.save(function(err) {
                        if (err) done(err);

                        done(null, user, 'Success');
                    });
                });
            }
        });
    });
};