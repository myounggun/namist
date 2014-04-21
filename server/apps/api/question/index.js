/**
 * 짤방 문제 API
 */
var app = express(),
	controller = require('./controllers/QuestionController');

app.get('/api/question/list', controller.list);
app.get('/api/question/read', controller.read);
app.get('/api/question/submit', controller.submit);
app.get('/api/question/search', controller.search);
app.get('/api/question/poll', controller.poll);

module.exports = app;