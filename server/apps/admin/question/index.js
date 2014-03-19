/**
 * 문제 출제 담당 페이지
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./questionController');

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/admin/question', function (req, res) {
	res.send('question bank');
});

app.get('/admin/question/list',  controller.list);