/**
 * 문제 출제 담당 페이지
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./controllers/QuestionController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/admin/question', controller.list);
app.get('/admin/question/add', controller.add);
app.get('/admin/question/edit/:id', controller.edit);

app.post('/admin/question/create', controller.create);
app.get('/admin/question/:id', controller.read);
app.put('/admin/question', controller.update);
app.del('/admin/question', controller.del);