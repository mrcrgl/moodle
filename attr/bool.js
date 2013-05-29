/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 11.03.13
 * Time: 09:10
 *
 */

var DefaultAttrType = require('./default');

/**
 * @class AttrBool
 *
 * @extends AttrDefault
 * @param attr
 * @constructor
 */
var AttrType = function(attr) {

    this.initialize(attr);

    this.validator(function(self, v) {
        if (v !== true && v !== false) {
            self.errors.push("Not a valid boolean: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

AttrType.prototype.set = function(v) {
  if (['true', 'on', '1'].indexOf(String(v).toLowerCase()) !== -1) {
    return true;
  }
  return false;
};

module.exports = AttrType;