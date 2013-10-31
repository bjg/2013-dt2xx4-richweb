/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , home = require('./routes/home')
  , entry = require('./routes/entry')
  , http = require('http')
  , path = require('path');

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

var db = require('mongoskin').db('localhost:27017/calendar', {safe:true});
app.param('collectionName', function(req, res, next, collectionName) {
  req.collection = db.collection(collectionName)
  return next()
});

app.get('/', home.index);

app.get('/calendar/:collectionName', entry.index);
app.get('/calendar/:collectionName/:id', entry.show);
app.post('/calendar/:collectionName', entry.create);
app.put('/calendar/:collectionName/:id', entry.update);
app.del('/calendar/:collectionName/:id', entry.del);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

