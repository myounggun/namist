var VerifyUser = require('../VerifyUser');

module.exports.verify = function(req, res, next) {
    var token = req.params.token;

    VerifyUser(token, function(err, account, resText) {
        if (err) {
            console.log(err);
            res.render('verifyFailure', {
                locals: {
                    "token": token
                },
                cache: false
            });
        } else {
            var locals = {
                    "token": token,
                    "account": {
                        "username": account.username,
                        "email": account.email
                    }
                },
                tplName = 'verify'+ resText; // ['Success', 'Already']

            res.render(tplName, {
                locals: {
                    "token": token,
                    "account": {
                        "username": account.username,
                        "email": account.email
                    }
                },
                cache: false
            });
        }
    });
};