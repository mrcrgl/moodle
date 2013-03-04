/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 02.03.13
 * Time: 14:11
 *
 */

var DefaultAttrType = require('./default');

var AttrType = function(attr) {
    this.initialize(attr);
};

AttrType.prototype = new DefaultAttrType();

module.exports = AttrType;