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
		usernames: [{type: String}]
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