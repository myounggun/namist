/**
 * 이미지 프로세싱 테스트 
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./controllers/GMController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/gm/test', controller.test);