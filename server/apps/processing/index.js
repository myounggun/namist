/**
 * 이미지 프로세싱 테스트 
 */
var express = require('express');
var app = module.exports = express();

var controller = require('./controllers/IMController');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/im/test', controller.test);