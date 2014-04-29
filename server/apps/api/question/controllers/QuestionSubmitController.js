/**
 * 문제 제목 제출 API 
 * /api/question/submit?id=91&title=재미없는짤방
 */
var Question = require('../../../admin/question/Question');

module.exports = function(req, res) {
    var title = decodeURIComponent(req.query.title);
    var query = {id: req.query.id};
    var updateOption = {
        $push: {
            'titles': {'title': title}
        }
    };
    
    Question.update(query, updateOption, {upsert: true}, function(err, updateCount){
        if (err) console.log(err);
        
        var status = 'error';

        if (!err && updateCount > 0) {
            status = 'success';
        }

        res.json({
            status : status
        });
    });
}