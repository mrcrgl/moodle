/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 26.03.13
 * Time: 12:01
 *
 */

var DefaultAttrType = require('./default');

/**
 * @class AttrObjectId
 *
 * @extends AttrDefault
 * @param attr
 * @constructor
 */
var AttrType = function(attr) {

    this.initialize(attr);

    this.default(undefined);
    this.required(false);

    this.validator(function(self, v) {
        if (!v || !v.toString().match(/^([0-9a-f]{24})$/)) {
            self.errors.push("Not a valid ObjectId: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

module.exports = AttrType;