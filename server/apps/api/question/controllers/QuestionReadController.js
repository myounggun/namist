/**
 * 문제 정보 조회 API (query: id)
 * /api/question/read?id=91
 * 
 */
var Question = require('../../../admin/question/Question');

module.exports = function(req, res) {
    var query  = {id: req.query.id};
    var fields = 'id date image time titles displayDate';
    
    Question.findOne(query, fields, function(err, doc) {
        if (err) console.log(err);
        
        var status = 'error';

        if (!err && doc) {
            status = 'success';
        } else if (!doc) {
            status = 'not_found';
        }

        var result = {
            status : status,
            item   : doc
        };

        res.json(result);
    });
}