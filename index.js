/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 02.03.13
 * Time: 13:36
 *
 */

var DefaultStorage  = require('./storage/default');
    DefaultAttrType = require('./attr/default');


module.exports = function(name) {

    var Model = function(attrs) {
        if (!(this instanceof Model)) return new model(attrs);

        this.attrs = {};

        this.set(attrs);
    };

    Model._attributes = {};
    Model._storageEngine = new DefaultStorage();

    Model.storage = function(sStorageType) {
        if (sStorageType) {
            var Storage = require('./storage/' + sStorageType.toLowerCase());
            this._storageEngine = new Storage();
        }

        return this._storageEngine;
    };

    Model.attr = function(sAttr, sType) {
        if (sType) {
            if (sAttr == 'id' || sAttr == '_id') {
                this.prototype.primaryKey = sAttr;
            }

            var AttrType = require('./attr/' + sType.toLowerCase());
            this._attributes[sAttr] = new AttrType(sAttr);
        }

        var model = this;
        this.prototype[sAttr] = function(val) {
            if (0 == arguments.length) return this.attrs[sAttr] || undefined;

            if (model._attributes[sAttr].validate(val)) {
                //log.info("Attr %s is valid (%s)", sAttr, val);
            }
            this.attrs[sAttr] = val;

            return this;
        };

        return this._attributes[sAttr];
    };

    Model.find = function(where, order, limit, offset, callback) {
        this._storageEngine.query()
            .select()
            .where(where)
            .order(order)
            .limit(limit || 30)
            .offset(offset || 0)
            .call(function(err, data) {
                if (data instanceof Array && data.length > 0) {
                    for (var i in data) {
                        data[i] = new Model(data[i]);
                    }

                    callback(err, data);
                } else {
                    callback(err, []);
                }
            });
    };

    Model.findOne = function(filter, callback) {
        this._storageEngine.query().select().where(filter).limit(1).call(function(err, data) {
            if (data instanceof Array && data.length > 0) {
                callback(err, new Model(data.shift()));
            } else {
                callback(err);
            }
        });
    };

    Model.prototype.model = Model;

    Model.prototype.getAttrType = function(attr) {
        return this.model._attributes[attr];
    };


    Model.prototype.set = function(object) {
        if (object instanceof Object) {
            for (var attr in object) {
                if (typeof this[attr] == 'function')
                    this[attr](object[attr]);
            }
        }
    };

    Model.prototype.toJSON = function() {
        var object = {};

        for (var attr in this.model._attributes) {
            object[attr] = this[attr]();
        }

        return object;
    };

    Model.prototype.validate = function() {
        var errors = {};

        for (var attr in this.model._attributes) {
            if (!this.getAttrType(attr).validate(this.attrs[attr])) {
                errors[attr] = this.getAttrType(attr).errors;
            }
        }

        return (Object.keys(errors).length < 1) ? true : errors;
    };

    Model.prototype.save = function(callback) {
        var check = this.validate();
        if (check === true) {

            if (this.isValid()) {
                var where = {};
                where[this.primaryKey] = this.attrs[this.primaryKey];

                this.model._storageEngine.query().update().where(where).set(this.attrs).limit(1).call(callback);
            } else {
                this.model._storageEngine.query().insert().set(this.attrs).call(function(err, data) {
                    if (data.affectedRows > 0) {
                        this[this.primaryKey](data.insertId);
                    }

                    callback(err, data.insertId || null);
                }.bind(this));
            }

        } else {
            callback(check);
        }
    };

    Model.prototype.isValid = function() {
        return !isNaN(this.attrs[this.primaryKey])
    };

    Model.prototype.delete = function() {

    };

    return Model;
};
