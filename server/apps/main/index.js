/**
 * 메인 페이지
 */
var express = require('express'),
    app = express();

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

module.exports = app;