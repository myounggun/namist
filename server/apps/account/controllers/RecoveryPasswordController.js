var User = require('../model/User'),
    PasswordToken = require('../model/PasswordToken');

module.exports = {
    verify: function (req, res, next) {
        var token = req.params.token;

        verifyUser(token, function (err, user) {
            if (err) {
                return next(err);
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
            var err = new Error();
            err.status = 400;

            return done(err, null);
        }

        User.findOne({_id: refToken._userId}, function (err, user) {
            if (err) {
                return done(err, null);
            }

            done(null, user);
        });
    });
}