var Account = require('../model/Account'),
    PasswordToken = require('../model/PasswordToken');

module.exports = {
    verify: function (req, res) {
        var token = req.params.token;

        verifyUser(token, function (err, user) {
            if (err) {
                if (err.name === 'CustomError') {
                    res.send(err.message);
                    res.end();
                }

                throw err;
            }

            res.render('formNewPassword', {id: user._id});
        });
    }
};

function verifyUser (token, done) {
    PasswordToken.findOne({token: token}, function (err, refToken) {
        if (err) {
            return done(err, null);
        }

        if (!refToken) {
            var err = new Error('Access to Namist has been denied');
            err.name = 'CustomError';

            return done(err, null);
        }

        Account.findOne({_id: refToken._userId}, function (err, user) {
            if (err) {
                return done(err, null);
            }

            done(null, user);
        });
    })
}