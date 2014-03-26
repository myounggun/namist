var tokenModel = require('./VerificationTokenModel');

module.exports = function(token, done) {
    tokenModel.findOne({token: token}, function (err, refUser){
        if (err) return done(err);

        console.log(refUser);

        if (!refUser) return done(new Error('unrecognized token!'));

        var Account = require('../account/Account');

        Account.findOne({
            _id: refUser._userId
        }, function(err, user) {
            if (err) return done(err);

            user['authentication'] = true;
            user.save(function(err) {
                if (err) done(err);

                done();
            });
        });
    });
};