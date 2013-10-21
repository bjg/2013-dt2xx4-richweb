'use strict';

var Message = (function() {

  var timestamp = function() {
    return +new Date;
  }

  var db = require('mongoskin').db('localhost:27017/messages', {safe:true});
  var collection = db.collection('messages');

  // Constructor
  function Message(properties) {
    var keys = Object.keys(properties);
    var _i, k;
    for (_i = 0; _i < keys.length; _i++) {
      k = keys[i]
      this[k] = properties[k];
    }
  };

  Message.collection = function() {
    return collection;
  }

  /**
   * Return a list of all currently added messages
   * @returns {Array}
   */
  Message.create = function(properties, cb) {
    var message;
    properties.created_at = timestamp();
    message = new Message(properties);
    message.save(cb);
    return message;
  };
  Message.find = function(filter, cb) {
    collection.find(filter, {sort: [['_id', -1]]}).toArray(function(e, results) {
      if (e) cb(e)
      else {
        var messages = [], _i;
        for (_i = 0; _i < results.length; _i++) {
          messages.push(new Message(results[_i]));
        }
        cb(null, messages);
      }
    });
  };
  Message.all = function(cb) {
    return Message.find({}, cb);
  };
  Message.findById = function(id, cb) {
    collection.findOne({_id: id}, function(e, result) {
      if (e) cb(e)
      else {
        cb(null, new Message(result));
      }
    });
  };

  Message.prototype.save = function(cb) {
    collection.insert(Object.keys(this), {}, cb);
  };
  Message.prototype.update = function(properties, cb) {
    collection.update({_id: this._id}, {$set:properties}, {safe:true, multi:false}, cb);
  };
  Message.prototype.text = function() {
    return this.text;
  };

  return Message;
})();

module.exports = Message;