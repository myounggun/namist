var app = express(),
    controller = require('./controllers/ToolsController');

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/tools/account/list', controller.accountList);
app.get('/tools/token/list', controller.tokenList);

app.delete('/tools/account/:id', controller.accountDelete);
app.delete('/tools/token/:id', controller.tokenDelete);

module.exports = app;