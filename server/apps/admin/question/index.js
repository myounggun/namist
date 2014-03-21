/**
 * 문제 출제 담당 페이지
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./questionController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/admin/question/list', controller.list);
app.get('/admin/question/add',  controller.add);
app.post('/admin/question/create',  controller.create);