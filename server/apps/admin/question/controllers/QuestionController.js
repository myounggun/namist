var Question = require('../Question');
var Uploader = require('./QuestionImageUploader');
var async = require('async');

var LIST_PAGE_TITLE = "문제 목록";
var ADD_PAGE_TITLE  = "문제 추가";
var EDIT_PAGE_TITLE = "문제 수정";
var READ_PAGE_TITLE = "문제 정보";

var hours = null;
var page = 1;
var pageSize = 5;

function list(req, res) {
	page = req.query.page || 1;

	async.waterfall([
  		function(callback) {
  			Question.count({}, function(err, count) {
  				callback(null, count);
  			});
  		},
  		function(totalCount, callback) {
  			var pagingOption = {
  					sort  : {id: -1},
					skip  : (page - 1) * pageSize, 
					limit : pageSize
			};
  			
  			Question.find({}, {}, pagingOption, function (err, docs) {
				var data = {
						title     : LIST_PAGE_TITLE,
						questions : docs,
						page      : page,
						totalPage : Math.ceil(totalCount / pageSize)
				};
				
				res.render('list', {
					locals: data,
					cache: false
				});
			});
  		}
  	], 
  	function (err, result) {
		if (err) throw err;
  	});
}

function add(req, res) {
	res.render('add', {
		locals: {
			title : ADD_PAGE_TITLE,
			hours : getHours(),
			page  : page
		}
	});
}

function edit(req, res) {
	Question.findOne({
		id: req.params.id
	}, 
	function (err, doc) {
		if (err || !doc) {
			res.redirect('/admin/question/?page=' + page);
			return;
		}
		
		res.render('edit', {
			locals: {
				title    : EDIT_PAGE_TITLE,
				hours    : getHours(),
				question : doc		
			}
		});
	});
}

function create(req, res) {
	Uploader.uploadImage(req.files, function (filename, imageURL, thumbURL) {
		req.body.image = imageURL;
		req.body.thumb = thumbURL;
		
		var document = getDocumentOfCollectionBy(req.body);

		new Question(document).save(function (err, doc) {
			if (err) throw err;
			
			res.redirect('/admin/question/' + doc.id);
		});
	});
}

function read(req, res) {
	Question.findOne({
		id: req.params.id
	}, 
	function (err, doc) {
		if (err || !doc) {
			res.redirect('/admin/question/?page=' + page);
			return;
		}

		res.render('read', {
			locals: {
				title    : READ_PAGE_TITLE,
				question : doc,
				page     : page
			}
		});
	});
}

function update(req, res) {
	var document = getDocumentOfCollectionBy(req.body);
	
	Question.update({
		id: req.body.id
	}, 
	{$set: document},
	{safe: true}, 
	function (err, result) {
		if (err) throw err;
		
		res.redirect('/admin/question/' + req.body.id);
	});
}

function del(req, res) {
	var condition = {id: req.body.id};

	Question.findOne(condition, function (err, doc) {
		if (err) throw err;
		
		Uploader.removeImage([doc.image, doc.thumb], function (result) {
			Question.remove(condition, function(err, removeCnt) {
				if (err) throw err;
				
				res.redirect('/admin/question/?page=' + page);
			});
		});
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

/**
 * 문제 등록/수정 처리를 위해 Form 입력 값을 Document 형태로 반환한다.
 * 
 * @param body	req.body
 * @returns document
 */
function getDocumentOfCollectionBy(body) {
	if (!body) return null;
	
	var document = {
			image : body.image,
			thumb : body.thumb,
			time  : {
				start : body.startTime,
				end   : body.endTime
			}
	};
	
	return document;
}

exports.list   = list;
exports.add    = add;
exports.edit   = edit;
exports.create = create;
exports.read   = read;
exports.update = update;
exports.del    = del;