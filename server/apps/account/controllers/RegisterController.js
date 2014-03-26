/**
 * New node file
 */

var async		= require('async');
var passport	= require('passport');
var Account		= require('../Account');
var tokenizer = require('../../verification/Tokenizer.js');


// TODO 중복 이메일, 중복 아이디
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

		tokenizer.createToken(account, function(err, token) {
			if (err) throw err;

			passport.authenticate('local')(req, res, function () {
				res.send('Send verification email by token \''+ token +'\'. Complete!');
			});
		});
	});
}

exports.register = onRegister;