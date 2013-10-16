/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , http = require('http')
  , path = require('path')
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

var db = mongoskin.db('localhost:27017/test', {safe:true});

app.param('collectionName', function(req, res, next, collectionName) {
  req.collection = db.collection(collectionName)
  return next()
});

app.get('/', function(req, res) {
  res.send('please select a collection, e.g., /collections/messages')
});

app.get('/collections/:collectionName', function(req, res) {
  req.collection.find({}, {limit:10, sort: [['_id',-1]]}).toArray(function(e, results) {
    if (e) return next(e)
    res.send(results)
  });
});

app.post('/collections/:collectionName', function(req, res) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  });
});

app.get('/collections/:collectionName/:id', function(req, res) {
  req.collection.findOne({_id: req.collection.id(req.params.id)}, function(e, result) {
    if (e) return next(e)
    res.send(result)
  })
});

app.put('/collections/:collectionName/:id', function(req, res) {
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(e, result) {
    if (e) return next(e);
    res.send((result === 1) ? {msg:'success'} : {msg:'error'});
  });
});

app.del('/collections/:collectionName/:id', function(req, res) {
  req.collection.remove({_id: req.collection.id(req.params.id)}, function(e, result) {
    if (e) return next(e);
    res.send((result === 1) ? {msg:'success'} : {msg:'error'});
  });
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

