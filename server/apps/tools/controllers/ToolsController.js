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
	},

	accountDelete: function(req, res, next) {
		var objectId = req.params.id;

		AccountModel.remove({
			_id: objectId
		}, function(err, resCode) {
			if (err) throw err;

			if (resCode) {
				res.redirect('/tools/account/list');
			} else {
				res.send('삭제가 실패하였습니다!');
			}
		});
	},

	tokenDelete: function(req, res, next) {
		var objectId = req.params.id;

		TokenModel.remove({
			_id: objectId
		}, function(err, resCode) {
			if (err) throw err;

			if (resCode) {
				res.redirect('/tools/token/list');
			} else {
				res.send('삭제가 실패하였습니다!');
			}
		});
	}
};