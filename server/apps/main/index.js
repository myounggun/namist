/**
 * 메인 페이지
 */
var controller = require('./controllers/MainController'),
    app = express();

app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/', controller.index);

module.exports = app;