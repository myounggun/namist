/**
 * 로그인/로그아웃/회원가입 담당 페이지
 */
var express		= require('express');
var app			= module.exports = express();
var controller	= require('./controller/RegisterController');

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');


app.get('/login', function (req, res) {
	res.render('loginForm');
});

app.get('/register', function (req, res) {
	res.render('registerForm')
});

app.post('/register', controller.register);