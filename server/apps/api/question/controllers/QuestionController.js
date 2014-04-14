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
        console.log(doc)
		res.json(refineDoc(doc));
	});
}

/**
 * 제목 제출
 * /api/question/submit?id=12&title=재미없는짤방
 */
function submit(req, res) {
//    Question.find({id: req.query.id}, function(err, docs) {
//        console.log(docs);
//        var titleLists = docs[0]["titles"];
//        titleLists.push({ title : decodeURIComponent(req.query.title) });
//        Question.update({ id : req.query.id }, { "titles" : titleLists });
//    });

    Question.update({ id : req.query.id },
        { $push:
            { "titles" :
                { $each:
                    [ {
                        "title" : decodeURIComponent(req.query.title),
                        "users" : []
                    } ]
                }
            }
        }, function(){ console.log(arguments); }
    );
}

/**
 * 제출된 제목 조회
 * /api/question/search
 * /api/question/search?id=5
 */
function search(req, res) {
    var lists = [];
    var id = req.query.id;
    var idCondition = (id) ? { id : id } : {};

    Question.find(idCondition, {}, { sort : { date : -1 } }, function(err, docs) {
        var titles = docs[0].titles;

        titles.sort(sortList);
//        res.json(refineTitleInfo(titles));
        res.json(titles);
    });
}

/**
 * 투표하기
 * /api/question/poll?id=5&titleId=5338f7ad6551f167ace928f9
 */
function poll(req, res) {
    var user = req.user;
    var voterId = user.username;
    var selectedTitleId = req.query.titleId;
    var idCondition = { id : req.query.id };

    if(!req.query.id || !voterId) {
        throw "id 또는 voterId가 존재하지 않습니다.";
    }

    // TODO : 중복 투표 처리
    Question.findOne(idCondition, function(err, docs) {
        var titles = docs["titles"];

        for(var i = 0, len = titles.length; i < len; i++) {
            var title = titles[i];
            if(title["_id"].toString() === selectedTitleId) {
                title["users"].push({
                    name : voterId
                });
            }
        }
        Question.update(idCondition, { "titles" : titles }, function(err, newVal, raw) {
//            console.log(newVal, raw)
        });
        res.send(refineDoc(docs));
    });

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
		titles  : doc.titles,
		
		displayDate : doc.displayDate // virtual
	}
}

function sortList(list1, list2) {

    var list1Len = list1.length;
    var list2Len = list2.length;
    var list1Date = new Date(list1.date).getTime();
    var list2Date = new Date(list2.date).getTime();

    if(list1Len == list2Len) {
        if((list1Date > list2Date)) {
            return true;
        } else {
            return false;
        }
    }

    if(list1 > list2) {
        return true;
    } else {
        return false;
    }
}

function refineTitleInfo(titles) {

}

exports.list = list;
exports.read = read;
exports.submit = submit;
exports.search = search;
exports.poll = poll;
