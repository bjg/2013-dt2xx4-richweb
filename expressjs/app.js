/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , message = require('./routes/message')
  , http = require('http')
  , net = require('net')
  , path = require('path')
  , Message = require('./models/message');

var app = express();

// all environments
app.engine('ejs', engine);
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.locals.Message = Message;

app.get('/', message.index);

app.post('/messages', function(req, res, next) {
    var message = new Message(req.body.text);
    res.set({
        "Accept": "application/json"
    }).json(201, { "id": message.id(), "text": message.text() });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

