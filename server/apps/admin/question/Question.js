/**
 * 문제 출제 스키마 정의
 * 
 * 아아디 - sequence 처리 
 * 짤방 이미지
 * 출제 시간
 * 마감 시간
 * 제목 목록
 *  - 후보 제목
 *  - like 사용자 목록
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var dateFormat = require('dateformat');

var Schema = mongoose.Schema;

// 문제 출제자의 id, 문제(짤방)내용, 시간정보 스키마
// 해당 문제에 제목을 제출하게 되면 title 필드에 push.
var Question = new Schema({
	id    : {type: Number, require: true, unique: true},
	date  : {type: Date, default: Date.now},
	image : {type: String, require: true, trim: true},
	time  : {
		start : {type: String},
		end   : {type: String}
	},
	titles : [{
		title: {type: String},
        date : {type: Date, default: Date.now},
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        },
		users: [{
            name : {type: String},
            date : {type: Date, default: Date.now}
        }]
	}]
});

Question.virtual('displayDate')
.get(function () {
	return dateFormat(this.date, "yyyy-mm-dd");;
});

Question.plugin(autoIncrement.plugin, {
    model: 'Question',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Question', Question);