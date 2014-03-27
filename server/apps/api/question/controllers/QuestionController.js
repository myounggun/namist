/**
 * 문제 출제 목록/조회 
 */
var Question = require('../../../admin/question/Question');
var async = require('async');

exports.list = list;
exports.read = read;

/**
 * 문제 목록 API
 */
function list(req, res) {
	Question.find({}, {}, {sort : {id: -1}}, function (err, docs) {	
		res.send(docs);
	});
}

/**
 * 문제 정보 API
 */
function read(req, res) {
	Question.find({id: req.query.id}, function(err, docs) {
		res.send(docs);
	});
}