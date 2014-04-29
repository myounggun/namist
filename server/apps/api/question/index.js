/**
 * 짤방 문제 API
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./controllers/QuestionController');
var listController = require('./controllers/QuestionListController');
var readController = require('./controllers/QuestionReadController');

app.get('/api/question/list', listController);
app.get('/api/question/read', readController);
app.get('/api/question/submit', controller.submit);
app.get('/api/question/search', controller.search);
app.get('/api/question/poll', controller.poll);