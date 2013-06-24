/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 05.03.13
 * Time: 18:52
 *
 */

var DefaultAttrType = require('./default');

/**
 * @class AttrInteger
 *
 * @extends AttrDefault
 * @param attr
 * @constructor
 */
var AttrType = function(attr) {

    this.initialize(attr);

    this.validator(function(self, v) {
        if (isNaN(v)) {
            self.errors.push("Not a valid number: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

AttrType.prototype.set = function(v) {
  return parseInt(v);
};

module.exports = AttrType;
