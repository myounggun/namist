var Question = require('./questionModel');

exports.list = function(req, res) {
	Question.find({}, function(err, docs) {
		res.send('question bank len = ' + docs.length);
	});
};