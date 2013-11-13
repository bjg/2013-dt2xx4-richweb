module.exports = (function() {
    var md5 = require("MD5");
    var timestamp = function() {
        return +new Date();
    }
    var entries = {};

    return {
        index: function() {
            var all = [];
            Object.keys(entries).forEach(function(key) {
                all.push(entries[key]);
            });
            return all;
        },

        show: function(id) {
            if (id in entries) {
                return entries[id];
            }
            throw Error("show: record for id=" + id + " not found");
        },

        create: function(attrs) {
            var created_at = timestamp();
            var id = md5(created_at);
            attrs.created_at = created_at;
            attrs._id = id;
            entries[id] = attrs;
            return attrs;
        },

        update: function(id, attrs) {
            if (id in entries) {
                var created_at = attrs.created_at;
                entries[id] = attrs;
                attrs._id = id;
                attrs.created_at = created_at;
                return true;
            }
            throw Error("update: record for id=" + id + " not found");
        },

        remove: function(id) {
            if (id in entries) {
                delete entries[id];
                return true;
            }
            throw Error("remove: record for id=" + id + " not found");
        }
    }
}());
