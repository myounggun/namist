var VerifyUser = require('../VerifyUser');

module.exports.verify = function(req, res, next) {
    var token = req.params.token;

    VerifyUser(token, function(err) {
        if (err) {
            console.log(err);
            res.render('verifyFailure', {
                locals: {
                    "token": token
                },
                cache: false
            });
        } else {
            res.render('verifySuccess', {
                locals: {
                    "token": token
                },
                cache: false
            });
        }
    });
};