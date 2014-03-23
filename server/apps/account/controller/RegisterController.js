/**
 * New node file
 */

var async		= require('async');
var passport	= require('passport');
var Account		= require('../Account');

function onRegister (req, res) {
	var username	= req.body.username;
	var email		= req.body.email;
	var passwd		= req.body.password;
	
	var account = new Account({
		username: username,
		email: email
	});
	
	Account.register(account, passwd, function (err, account) {
		if (err) {
			console.log(err);
			res.render('registerForm', {
				account: account
			});
		}
		
		passport.authenticate('local')(req, res, function () {
			res.send('complete');
		});
	});
}

exports.register = onRegister;