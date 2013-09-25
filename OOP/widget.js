'use strict';

/*
 * Template code for creating classical objects in Javascript. Modify as required
 *
 * Note the use of closures and the encapsulation of internal details
 */

var md5 = require('MD5');

var Widget = (function() {
    var widgets = {};

    // Private utility methods
    var check = function(widget) {
        if (!widget._id) {
            throw Error('Widget.check: widget missing identifier: ' + widget);
        }
    };

    var timestamp = function() {
        return +new Date;
    }

    // Constructor
    function Widget(name) {
        if (!name) {
            throw Error('Widget(): missing name specification: ' + widget);
        }
        this.name = name;
        this._id = md5(this.name());
        this.createdAt = timestamp();
    };

    /*
     * "Class" methods
     */

    /**
     * Return a list of all currently registered widgets
     * @returns {Array}
     */
    Widget.all = function all() {
        var all = [], key;
        for (key in widgets) {
            if (widgets.hasOwnProperty(key)) {
                all.push(widgets[key]);
            }
        }
        return all;
    };
    /**
     * Register a new widget
     * @param widget instance ref
     * @returns widget instance ref
     */
    Widget.register = function register(widget) {
        check(widget);
        if (widgets[widget._id]) {
            throw Error('Widget.register: <' + widget._id + '> already registered!');
        }
        widgets[widget._id] = widget;
        return widget;
    };
    /**
     * Find a widget instance by id
     * @param id
     * @returns {widget}
     */
    Widget.findById = function find(id) {
        if (!widgets[id]) {
            throw Error('Widget.findById: <' + id + '> does not exist!');
        }
        return widgets[id];
    };
    /**
     * Find a widget instance by name
     * @param id
     * @returns {widget}
     */
    Widget.findByName = function find(name) {
        var all = Widget.all();
        for (var i = 0; i < all.length; i++) {
            if (all[i].name === name) {
                return all[i];
            }
        }
        throw Error('Widget.findByName: <' + name + '> does not exist!');
    };

    /*
     * "Instance" methods
     */
    Widget.prototype.name = function name() {
        return this._name;
    };
    Widget.prototype.id = function id() {
        return this._id;
    };
    /**
     * Unregister an existing widget
     */
    Widget.prototype.unregister = function unregister() {
        check(this);
        if (!widgets[this._id]) {
            throw Error('Widget.unregister: <' + this._id + '> is not registered!');
        }
        delete widgets[this._id];
    };

    // Finally, return a reference to the Widget class object
    return Widget;
})();

module.exports = Widget;
