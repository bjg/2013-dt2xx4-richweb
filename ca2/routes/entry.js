exports.index = function(req, res) {
    res.send(req.Entry.index(), 200);
};

exports.show = function(req, res, next) {
    try {
        res.send(req.Entry.show(req.params.id));
    } catch(err) {
        res.statusCode = 404;
        next(err);
    }
};

exports.create = function(req, res, next) {
    var entry;
    try {
        entry = req.Entry.create(req.body);
        res.send(entry, 201);
    } catch(err) {
        res.statusCode = 404;
        next(err);
    }
};

exports.update = function(req, res, next) {
    try {
        req.Entry.update(req.params.id, req.body);
        res.send(200);
    } catch(err) {
        res.statusCode = 404;
        next(err);
    }
};

exports.remove = function(req, res, next) {
    try {
        req.Entry.remove(req.params.id);
        res.send(200);
    } catch(err) {
        res.statusCode = 404;
        next(err);
    }
};