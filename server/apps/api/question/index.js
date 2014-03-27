/**
 * 짤방 문제 API 
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./controllers/QuestionController');

app.get('/api/question/list', controller.list);
app.get('/api/question/read', controller.read);