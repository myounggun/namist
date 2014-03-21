/**
 * 문제 출제 스키마 정의
 * 
 * 아아디 - sequence 처리 
 * 제목
 * 짤방 이미지
 * 출제 시간
 * 마감 시간
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var Question = new Schema({
	title : {type: String, require: true, trim: true},
	image : {type: String, require: true, trim: true},
	time  : {
		start : {type: String},
		end   : {type: String}
	}
});

Question.plugin(autoIncrement.plugin, {
    model: 'Question',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Question', Question);