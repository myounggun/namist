/**
 * 문제 제목 제출 API (query: id, title) - 로그인 필요
 * /api/question/title/submit?id=91&title=재미없는짤방
 */
var Question = require('../../../admin/question/Question');

module.exports = function(req, res) {
    if (!req.user) {
        return res.json({status: 'error', msg: '로그인이 필요합니다.'});
    }
    
    var title  = decodeURIComponent(req.query.title);
    var query  = {id: req.query.id};
    var updateOption = {
        $push: {
            'titles': {'title': title, '_id': req.user._id}
        }
    };
    
    Question.update(query, updateOption, {safe: true}, function(err, updateCount){
        if (err) console.log(err);
        
        var status = 'error';

        if (!err && updateCount > 0) {
            status = 'success';
        }

        res.json({
            status : status,
            upadte : updateCount
        });
    });
}