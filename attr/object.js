/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 18.03.13
 * Time: 16:23
 *
 */

var DefaultAttrType = require('./default');

/**
 * @class AttrObject
 *
 * @extends AttrDefault
 * @param attr
 * @constructor
 */
var AttrType = function(attr) {

    this.initialize(attr);
    this.default({});

    this.validator(function(self, v) {
        if (typeof v !== 'object') {
            self.errors.push("Not a valid object: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

AttrType.prototype.set = function(v) {
    if (typeof v == 'object' || v instanceof Array) {
        return new Object(v);
    }
    return {0:v};
};

module.exports = AttrType;