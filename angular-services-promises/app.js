/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , home = require('./routes/home')
  , message = require('./routes/message')
  , http = require('http')
  , path = require('path')
  , Message = require('./models/message')
  , mongoskin = require('mongoskin');

var app = express();

// all environments
app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
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

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = Message.collection(collectionName)
  return next()
});

app.get('/', function(req, res) {
    Message.all(function(e, results) {
        if (e) return next(e);
        app.locals.messages = results;
        home.index(req, res);
    });
});

app.get('/collections/:collectionName', message.index);
app.get('/collections/:collectionName/:id', message.show);
app.post('/collections/:collectionName', message.create);
app.put('/collections/:collectionName/:id', message.update);
app.del('/collections/:collectionName/:id', message.del);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

