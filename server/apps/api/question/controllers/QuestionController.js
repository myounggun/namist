/**
 * 문제 출제 목록/조회 
 */
var Question = require('../../../admin/question/Question');
var async = require('async');

/**
 * 문제 출제 목록 API (query: page, pageSize)
 */
function list(req, res) {
	var page     = parseInt(req.query.page, 10);
	var pageSize = parseInt(req.query.pageSize, 10) || 3;
	
	var pagingOption = {};
	
	if (page) {
		pagingOption = {
				sort  : {id: -1},
				skip  : (page - 1) * pageSize,
				limit : pageSize
		};
	}

	async.waterfall([
   		function(callback) {
   			Question.count({}, function(err, count) {
   				callback(null, count);
   			});
   		},
   		function(totalCount, callback) {
   			
   			Question.find({}, {}, pagingOption, function (err, docs) {
   				var result = {
   						page      : page,
   						pageSize  : pageSize,
   						totalPage : Math.ceil(totalCount / pageSize),
   						items     : refineDocs(docs, page, pageSize)
   				};
   				
   				res.json(result);
 			});
   		}
   	], 
   	function (err, result) {
 		if (err) throw err;
   	});
}

/**
 * 문제 출제 정보 API (query: id)
 */
function read(req, res) {
	Question.findOne({
		id: req.query.id
	}, 
	function(err, doc) {
		res.json(refineDoc(doc));
	});
}

function submit(req, res) {
    Question.find({id: req.query.id}, function(err, docs) {
        var titleLists = docs[0]["titles"];

        titleLists.push({ title : decodeURIComponent(req.query.title) });
        Question.update({ id : req.query.id }, { "titles" : titleLists }, function(err, newVal, raw) {
//            console.log(newVal, raw)
        });
    });
}

function search(req, res) {

}

function refineDocs(docs) {
    if (!docs) {
        return "No Data";
    }

    var result = [];
    for (var i = 0, l = docs.length; i < l; i++) {
        var doc = docs[i];
        result.push(refineDoc(doc));
    }

    return result;
}

function refineDoc(doc) {
	return {
		id      : doc.id,
		date    : doc.date,
		image   : doc.image,
		time    : doc.time,
		titles  : doc.title,
		
		displayDate : doc.displayDate // virtual
	}
}

exports.list = list;
exports.read = read;
exports.submit = submit;
exports.search = search;
