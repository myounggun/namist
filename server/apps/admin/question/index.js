/**
 * 문제 출제 담당 페이지
 */
var express = require('express');
var app = module.exports = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var controller = require('./controllers/QuestionController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/admin/question', controller.list);
app.get('/admin/question/add', controller.add);
app.get('/admin/question/edit/:id', controller.edit);

app.post('/admin/question/create', multipartMiddleware, controller.create);
app.get('/admin/question/:id', controller.read);
app.put('/admin/question', multipartMiddleware, controller.update);
app.del('/admin/question', controller.del);