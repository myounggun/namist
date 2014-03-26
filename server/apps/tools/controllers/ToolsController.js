var AccountModel = require('../../account/Account'),
	TokenModel = require('../../verification/VerificationTokenModel');

module.exports = {
	accountList: function(req, res, next) {
		AccountModel.find(function(err, accounts) {
			if (err) throw err;

			res.render('list', {
				locals: {
					'collectionName': 'Account',
					'collections': accounts.map(function(user) {
						return user.toObject()
					})
				},
				cache: false
			});
		});
	},

	tokenList: function(req, res, next) {
		TokenModel.find(function(err, tokens) {
			if (err) throw err;

			res.render('list', {
				locals: {
					'collectionName': 'Token',
					'collections': tokens.map(function(token) {
						return token.toObject()
					})
				},
				cache: false
			});
		});
	}
};