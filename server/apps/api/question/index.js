/**
 * 짤방 문제 API
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./controllers/QuestionController');

var listController = require('./controllers/QuestionListController');
var readController = require('./controllers/QuestionReadController');

var titleSubmitController = require('./controllers/QuestionTitleSubmitController');
var titleReadController   = require('./controllers/QuestionTitleReadController');

app.get('/api/question/list', listController);
app.get('/api/question/read', readController);

app.get('/api/question/title/submit', titleSubmitController);
app.get('/api/question/title/read', titleReadController);

app.get('/api/question/search', controller.search);
app.get('/api/question/poll', controller.poll);