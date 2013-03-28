/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 27.03.13
 * Time: 10:13
 *
 */

var DefaultAttrType = require('./default');

/**
 * @class AttrArray
 *
 * @extends AttrDefault
 * @param attr
 * @constructor
 */
var AttrType = function(attr) {

    this.initialize(attr);
    this.default([]);

    this.validator(function(self, v) {
        if (!v instanceof Array) {
            self.errors.push("Not a valid array: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

AttrType.prototype.set = function(v) {
    if (typeof v == 'object') {
        var array = [];
        var keys = Object.keys(v);
        for (var i=0;i<keys.length;i++) {
            array.push(v[keys[i]]);
        }
        return array;
    } else if (v instanceof Array) {
        return v;
    }
    return [v];
};

module.exports = AttrType;