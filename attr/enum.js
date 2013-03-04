/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 02.03.13
 * Time: 15:50
 *
 */

var DefaultAttrType = require('./default');

/**
 * @class AttrEnum
 *
 * @extends AttrDefault
 * @param attr
 * @constructor
 */
var AttrType = function(attr) {

    this.fieldOptions = [];

    this.initialize(attr);

    this.validator(function(self, v) {
        if (self.fieldOptions.indexOf(v) === -1) {
            self.errors.push("Not a valid option: "+v);
        }
    });

};

AttrType.prototype = new DefaultAttrType();

AttrType.prototype.option = function(opt) {
    if (this.fieldOptions.indexOf(opt) === -1) {
        this.fieldOptions.push(opt);
    }

    return this;
};

module.exports = AttrType;