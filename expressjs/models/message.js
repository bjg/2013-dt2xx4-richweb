'use strict';

var md5 = require('MD5');

var Message = (function() {
  var messages = {};

  var timestamp = function() {
    return +new Date;
  }

  // Constructor
  function Message(text) {
    this._created_at = timestamp();
    this._text = text;
    this._id = md5(Math.floor(this._created_at * Math.random()));
    messages[this._id] = this;
  };

  /**
   * Return a list of all currently added messages
   * @returns {Array}
   */
  Message.all = function() {
    var all = [];
    for (var key in messages) {
      if (clients.hasOwnProperty(key)) {
        all.push(messages[key]);
      }
    }
    return all;
  };

  Message.prototype.id = function() {
    return this._id;
  };
  Message.prototype.text = function() {
    return this._text;
  };

  return Message;
})();

module.exports = Message;