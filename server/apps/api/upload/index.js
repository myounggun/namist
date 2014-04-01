/**
 * 짤방 문제 API 
 */
var express = require('express');
var app = module.exports = express();
var fs = require('fs');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.bodyParser());

app.post('/api/upload/file', function(req, res){
	
	console.log("uploadfile");
	res.render("uploadTest");
	
	
});

app.get('/api/upload/test', function(req, res){
	
	res.render("uploadTest");
	
});