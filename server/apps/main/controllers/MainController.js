var Question = require('../../admin/question/Question');

module.exports = {
    index: function(req, res, next) {
        Question.find({}, {}, { sort : { date : -1 } }, function(err, docs) {
            var imageSrc = docs[0].image,
                imageTitle = null;

            console.log(docs);
            res.render('index', {
                user: req.user,
//                imageSrc: imageSrc,
                imageSrc: "/images/sw.jpg",
                imageTitle: imageTitle || "오늘의 짤방입니다."
            });
        });


    }
};