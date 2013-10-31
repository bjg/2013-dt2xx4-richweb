exports.index = function(req, res) {
  req.collection.find({}, {sort: [['_id',-1]]}).toArray(function(e, results) {
    if (e) return next(e);
    res.send(results);
  });
};

exports.show = function(req, res) {
  req.collection.findOne({_id: req.collection.id(req.params.id)}, function(e, result) {
    if (e) return next(e);
    res.send(result);
  });
};

exports.create = function(req, res) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e);
    res.send(results[0]);
  });
};

exports.update = function(req, res) {
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(e, result) {
    if (e) return next(e);
    res.send((result === 1) ? {msg:'success'} : {msg:'error'});
  });
};

exports.del = function(req, res) {
  req.collection.remove({_id: req.collection.id(req.params.id)}, function(e, result) {
    if (e) return next(e);
    res.send((result === 1) ? {msg:'success'} : {msg:'error'});
  });
};
