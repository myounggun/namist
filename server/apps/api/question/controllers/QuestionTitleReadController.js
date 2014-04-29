/**
 * 문제 제목 조회 API (query: id)
 * /api/question/title/read?id=91
 * 
 */
var Question = require('../../../admin/question/Question');

module.exports = function(req, res) {
    var query  = {id: req.query.id};
    var fields = 'titles';
    
    Question.findOne(query, fields, function(err, doc) {
        if (err) console.log(err);
        
        var status = 'error';

        if (!err && doc) {
            status = 'success';
        } else if (!doc) {
            status = 'not_found';
        }
        
        var titles = doc.titles;
        
        titles.sort(function(a, b) {
            return b.date.getTime() - a.date.getTime()
        });

        var result = {
            status : status,
            titles : titles
        };

        res.json(result);
    });
}

