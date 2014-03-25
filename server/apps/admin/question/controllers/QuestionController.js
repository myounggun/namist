var Question = require('../Question');
var async = require('async');

var LIST_PAGE_TITLE = "문제 목록";
var ADD_PAGE_TITLE  = "문제 추가";
var EDIT_PAGE_TITLE = "문제 수정";
var READ_PAGE_TITLE = "문제 정보";

var hours = null;
var page = 1;
var pageSize = 2;

function list(req, res) {
	page = req.query.page || 1;

	async.waterfall([
  		function(callback) {
  			Question.count({}, function(err, count) {
  				callback(null, count);
  			});
  		},
  		function(totalCount, callback) {
  			Question.find({}, {},{ 
						sort  : {id: -1},
						skip  : (page - 1) * pageSize, 
						limit : pageSize
					}, function (err, docs) {
				var data = {
						title: LIST_PAGE_TITLE,
						questions: docs,
						page: page,
						totalPage: Math.ceil(totalCount / pageSize)
				};
				
				res.render('list', {
					locals: data,
					cache: false
				});
			});
  		}
  	], function (err, result) {
  		if (err) console.log(err);
  	});
}

function add(req, res) {
	res.render('add', {
		locals: {
			title: ADD_PAGE_TITLE,
			hours: getHours()
		}
	});
}

function edit (req, res) {
	Question.findOne({id: req.params.id}, function (err, doc) {
		if (err || !doc) {
			res.redirect('admin/question');
			return;
		}

		var data = {
				title: EDIT_PAGE_TITLE,
				hours: getHours(),
				question: doc		
		};
		
		res.render('edit', {
			locals: data,
			cache: false
		})
	});
}

function create(req, res) {
	var row = {
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
		
		res.redirect('/admin/question/' + doc.id);
	});
}

function read(req, res) {
	Question.findOne({id: req.params.id}, function (err, doc) {
		if (err || !doc) {
			res.redirect('/admin/question');
			return;
		}

		res.render('read', {
			locals: {
				title: READ_PAGE_TITLE,
				question: doc,
				page: page
			}
		});
	});
}

function update(req, res) {
	var row = {
			image : req.body.image,
			time  : {
				start : req.body.startTime,
				end   : req.body.endTime
			}
	};
	
	Question.update({id: req.body.id}, {$set: row}, 
			{safe: true}, function (err, doc) {
				res.redirect('/admin/question/' + doc.id);
	});
}

function del(req, res) {
	Question.remove({id: req.body.id}, function(err, docs) {
		if (err) {
			throw new Error('del error : ' + err);
		}
		
		res.redirect('/admin/question');
	});
}

function createHours() {
	if (hours) {
		return hours;
	}
	
	hours = [];
	hours.push({name:"시간선택", value:""});
	for (var i = 0; i < 24; i++) {
		var value = i;
		var name = (i % 12) ? i % 12 : 12;
		var ampm = (i >= 12) ? 'PM' : 'AM';
		
		value = ('00' + value).slice(-2);
		name  = ('00' + name).slice(-2);
		
		hours.push({
				name  : name  + ':00 ' + ampm,
				value : value + ':00'
		});
		
		hours.push({
			name  : name  + ':30 ' + ampm,
			value : value + ':30'
		});
	}
	
	return hours;
}

function getHours() {
	return createHours();
}

exports.list   = list;
exports.add    = add;
exports.edit   = edit;
exports.create = create;
exports.read   = read;
exports.update = update;
exports.del    = del;