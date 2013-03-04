/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 02.03.13
 * Time: 14:11
 *
 */

var AttrType = function(attrName) {


    this.initialize(attrName);
};

AttrType.prototype.initialize = function(attrName) {

    this.attrName = attrName;

    this.attrAlias = null;

    this.errors = [];

    this.options = {
        required: false,
        default: undefined,
        min: null,
        max: null,
        minLength: null,
        maxLength: null
    };

    this.validators = [];

};

AttrType.prototype.getOption = function(option) {
    return this.options[option] || null;
};

AttrType.prototype.setOption = function(option, value) {
    this.options[option] = value;
};

AttrType.prototype.validate = function(v) {
    var self = this;
    var fns = this.validators;
    self.errors = [];

    if (this.requirement(v)) {
        self.errors = [];

        for (var i in fns) {
            fns[i](self, v);
        }
    }

    return (self.errors.length <= 0);
};

AttrType.prototype.requirement = function(v) {
    if (this.getOption('required') && undefined === v) {
        this.errors.push(this.alias() + " is required.");

        return false;
    }

    return true;
};

AttrType.prototype.alias = function(alias) {
    if (0 == arguments.length) return this.attrAlias || this.attrName;

    this.attrAlias = alias;

    return this;
};

AttrType.prototype.required = function() {

    this.setOption('required', true);

    return this;
};

AttrType.prototype.validator = function(fnc) {

    this.validators.push(fnc);

    return this;
};

AttrType.prototype.default = function(val) {
    if (0 == arguments.length) return this.getOption('default');

    this.setOption('default', val);

    return this;
};

AttrType.prototype.value = function(val) {
    if (0 == arguments.length) return this._value;

    this._value = val;

    return this;
};

module.exports = AttrType;