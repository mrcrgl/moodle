/**
 * @author: Marc Riegel <marc.riegel@net-m.de>
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

    this.validator(function(self, v) {
        if (typeof v !== 'object') {
            self.errors.push("Not a valid object: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

module.exports = AttrType;