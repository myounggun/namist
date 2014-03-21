var Question = require('./questionModel');

function list(req, res) {
	Question.find({}, function (err, docs) {
		var data = {
				title: "문제 목록",
				questions: docs
		};
		
		res.render('list', {
			locals: data,
			cache: false
		});
	});
}

function add(req, res) {
	res.render('add', {
		locals: {
			title: "문제 추가"
		}
	});
}

function create(req, res) {
	var row = {
			title : req.body.title,
			image : req.body.image,
			time  : {
				start : req.body.startTime,
				end   : req.body.endTime
			}
	};
	
	new Question(row).save(function (err, doc) {
		if (err) {
			throw new Error('create error : ' + err);
		}
		
		res.redirect('/admin/question/list');
	});
}

exports.list   = list;
exports.add    = add;
exports.create = create;