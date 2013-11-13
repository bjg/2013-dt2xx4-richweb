
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var entry = require('./routes/entry');
var Entry = require('./models/entry');

var app = express();

// all environments
app.set('views', path.join(__dirname, 'app'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.param('entries', function(req, res, next, entry) {
    req.Entry = Entry;
    return next();
});

app.get('/', routes.index);

app.get('/calendar/:entries', entry.index);
app.get('/calendar/:entries/:id', entry.show);
app.post('/calendar/:entries', entry.create);
app.put('/calendar/:entries/:id', entry.update);
app.del('/calendar/:entries/:id', entry.remove);

// Grunt is directing the startup
module.exports = app;