/**
 * 문제 제목 투표 API (query: id, titleId) - 로그인 필
 * /api/question/title/poll?id=91&titleId=535f7eb57e568f6b16b46503
 * 
 * 중첩 배열에 $push, $addToSet 적용 안되는 버그 있음.
 * http://stackoverflow.com/questions/12623554/using-mongodb-how-do-i-update-a-sub-document-of-a-sub-array-when-element-positi
 */
//var mongoose = require('mongoose');
var Question = require('../../../admin/question/Question');

module.exports = function(req, res) {
    if (!req.user) {
        return res.json({status: 'error', msg: '로그인이 필요합니다.'});
    }

    var questionID = req.query.id;
    var titleID    = req.query.titleId;
    
    if(!questionID || !titleID) {
        return res.json({status: 'error'});
    }
    
    var query = {id : questionID};
    var fields = 'titles';
    
    Question.findOne(query, function(err, doc) {
        var titles = doc["titles"];

        for (var i = 0, t; t = titles[i]; i++) {
            if (t._id.toString() === titleID) {
                t.users.push({
                    id   : req.user._id,
                    name : req.user.username
                });
            }
        }
        
        Question.update(query, {"titles": titles}, function(err, updateCount) {
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
    });
}

//module.exports = function(req, res) {
//    if (!req.user) {
//        return res.json({status: 'error', msg: '로그인이 필요합니다.'});
//    }
//
//    var questionID = req.query.id;
//    var titleID    = req.query.titleId;
//    
//    if(!questionID || !titleID) {
//        return res.json({status: 'error'});
//    }
//    
//    var query = {
//        id             : questionID,
//        'titles._id'   : mongoose.Types.ObjectId(titleID)
//    };
//    
//    /**
//     * 중첩 배열에 push, addToSet 적용 안되는 버그 있음.
//     * http://stackoverflow.com/questions/12623554/using-mongodb-how-do-i-update-a-sub-document-of-a-sub-array-when-element-positi
//     */
//    var updateOption = {
//        $addToSet: {
//            'titles.$.users': req.user.username
//        }
//    };
//    
//    Question.update(query, updateOption, {safe: true}, function(err, updateCount){
//        if (err) console.log(err);
//        
//        var status = 'error';
//
//        if (!err && updateCount > 0) {
//            status = 'success';
//        }
//
//        res.json({
//            status : status,
//            upadte : updateCount
//        });
//    });
//}
