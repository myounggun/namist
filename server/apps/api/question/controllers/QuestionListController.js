/**
 * 문제 목록 조회 API (query: page, pageSize)
 * /api/question/list?page=1&pageSize=3
 * 
 */
var Question = require('../../../admin/question/Question');
var async = require('async');

function getQuesionCount(query, callback) {
    Question.count(query, function(err, totalCount) {
        callback(err, totalCount);
    });
}

function getQuestions(query, fields, pagingOption, totalCount, callback) {
    Question.find(query, fields, pagingOption, function (err, questions) {
        callback(err, questions, totalCount);
    });
}

module.exports = function(req, res) {
    var page     = parseInt(req.query.page, 10) || 1;
    var pageSize = parseInt(req.query.pageSize, 10) || 3;

    var query  = {}; 
    var fields = 'id date image time titles displayDate';
    var pagingOption = {
        skip  : (page - 1) * pageSize,
        limit : pageSize,
        sort  : {id: -1}
    };

    async.waterfall([
        getQuesionCount.bind(null, query),
        getQuestions.bind(null, query, fields, pagingOption)
    ],
    function (err, questions, totalCount) {
        if (err) console.log(err);
        
        var status = 'error';
        
        if (!err && questions) {
            status = 'success';
        }
        
        var result = {
            status    : status,
            page      : page,
            pageSize  : pageSize,
            totalPage : Math.ceil(totalCount / pageSize),
            items     : questions
        };

        res.json(result);
    });
}