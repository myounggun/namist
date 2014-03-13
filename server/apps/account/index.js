/**
 * 로그인/로그아웃/회원가입 담당 페이지
 */
var express = require('express');
var app = module.exports = express();

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/login', function (req, res) {
	res.render('login');
});