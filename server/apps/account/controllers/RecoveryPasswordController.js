var Account = require('../model/Account'),
    PasswordToken = require('../model/PasswordToken');

module.exports = {
    verify: function (req, res) {
        var token = req.params.token;

        verifyUser(token, function (err, user) {
            if (err) {
                throw err;
            }

            res.render('formNewPassword', {
                id: user._id,
                message: null
            });
        });
    }
};

function verifyUser (token, done) {
    PasswordToken.findOne({token: token}, function (err, refToken) {
        if (err) {
            return done(err, null);
        }

        if (!refToken) {
            return done(new Error('잘못된 토큰입니다.'), null);
        }

        Account.findOne({_id: refToken._userId}, function (err, user) {
            if (err) {
                return done(err, null);
            }

            done(null, user);
        });
    })
}