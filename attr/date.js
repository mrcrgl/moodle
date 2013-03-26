/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 26.03.13
 * Time: 15:23
 *
 */

var DefaultAttrType = require('./default');

var AttrType = function(attr) {
    this.initialize(attr);

    this.validator(function(self, v) {
        if (undefined !== v && !v instanceof Date) {
            self.errors.push("Not a valid Date: "+v);
        }
    });
};

AttrType.prototype = new DefaultAttrType();

AttrType.prototype.set = function(v) {
    if (v instanceof Date) {
        return v;
    }
    return new Date(v);
};

module.exports = AttrType;