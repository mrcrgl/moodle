/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 02.03.13
 * Time: 13:36
 *
 */

var DefaultStorage = require('./storage/default'),
  DefaultAttrType = require('./attr/default');


module.exports = function (name) {

  var Model = function (attrs) {
    if (!(this instanceof Model)) {
      return new Model(attrs);
    }

    this.attrs = {};

    if (attrs instanceof Object) {
      this.set(attrs);
    }
  };

  Model._attributes = {};
  Model._storageEngine = new DefaultStorage();

  Model.storage = function (sStorageType) {
    // TODO check arguments

    if (sStorageType) {
      var Storage = require('./storage/' + sStorageType.toLowerCase());
      this._storageEngine = new Storage();
    }

    return this._storageEngine;
  };

  Model.attr = function (sAttr, sType) {
    // TODO check arguments

    var model = this,
      AttrType = null;

    if (sType) {
      if (sAttr === 'id' || sAttr === '_id') {
        this.prototype.primaryKey = sAttr;
      }

      AttrType = require('./attr/' + sType.toLowerCase());
      this._attributes[sAttr] = new AttrType(sAttr);
    }


    this.prototype[sAttr] = function (val) {
      if (0 === arguments.length) {
        return ('undefined' === typeof this.attrs[sAttr])
          ? model._attributes[sAttr].default()
          : this.attrs[sAttr];
      }

      val = model._attributes[sAttr].set(val);

      //if (model._attributes[sAttr].validate(val)) {
        //log.info("Attr %s is valid (%s)", sAttr, val);
      //}
      this.attrs[sAttr] = val;

      return this;
    };

    return this._attributes[sAttr];
  };

  /* where, callback */
  Model.count = function () {
    var callback = (arguments.length > 0) ? arguments[arguments.length - 1] : function () {},
      where = (arguments.length > 1) ? arguments[0] : undefined;

    if ('function' !== typeof callback) {
      throw "Callback not defined.";
    }

    this._storageEngine.query()
      .count()
      .where(where)
      .call(function (err, data) {
        if (data instanceof Array && data.length === 1) {
          callback(err, data[0].count || 0);
        } else {
          callback(err, 0);
        }
      });
  };

  /* where, order, limit, offset, callback */
  Model.find = function () {
    var callback = (arguments.length > 0) ? arguments[arguments.length - 1] : function () {},
      where = (arguments.length > 1) ? arguments[0] : undefined,
      order = (arguments.length > 2) ? arguments[1] : undefined,
      limit = (arguments.length > 3) ? arguments[2] : undefined,
      offset = (arguments.length > 4) ? arguments[3] : undefined;

    if ('function' !== typeof callback) {
      throw "Callback not defined.";
    }

    this._storageEngine.query()
      .select()
      .where(where)
      .order(order)
      .limit(limit || 30)
      .offset(offset || 0)
      .call(function (err, data) {
        if (data instanceof Array && data.length > 0) {
          var i = null;

          for (i = 0; i < data.length; i++) {
            data[i] = new Model(data[i]);
          }

          callback(err, data);
        } else {
          callback(err, []);
        }
      });
  };

  Model.findOne = function () { /* where, callback */
    var callback = (arguments.length > 0) ? arguments[arguments.length - 1] : function () {},
      where = (arguments.length > 1) ? arguments[0] : undefined;

    this._storageEngine.query().select().where(where).limit(1).call(function (err, data) {
      if (data instanceof Array && data.length > 0) {
        //var currentData = data.shift();
        //console.log("Create Model of " + JSON.stringify(data[0]));

        var model = new Model(data[0]);
        callback(err, model);
      } else {
        callback(err, new Model()); // return empty model instance
      }
    });
  };

  Model.prototype.model = Model;

  Model.prototype.getAttrType = function (attr) {
    return this.model._attributes[attr];
  };

  Model.prototype.set = function (object) {
    //console.log("model.set called: " + object);
    if (object instanceof Object) {
      //console.log("object is instanceif Object");
      var keys = Object.keys(object),
        key = null,
        n = null;
      for (n = 0; n < keys.length; n++) {
        key = keys[n];
        if (typeof this[key] == 'function') {
          this[key](object[key]);
        }
      }
      //console.dir(this.attrs);
    } else {
      console.log("Model.set: Object expected but " + typeof(object) + " received");
    }
  };

  Model.prototype.toJSON = function () {
    var object = {};

    for (var attr in this.model._attributes) {
      object[attr] = this[attr]();
    }

    return object;
  };

  Model.prototype.validate = function () {
    var errors = {};

    for (var attr in this.model._attributes) {
      if (!this.getAttrType(attr).validate(this.attrs[attr])) {
        errors[attr] = this.getAttrType(attr).errors;
      }
    }

    return (Object.keys(errors).length < 1) ? true : errors;
  };

  Model.prototype.save = function (/* callback */) {
    var callback = (arguments.length > 0) ? arguments[arguments.length - 1] : function () {
    };

    // TODO check for primaryKey

    var check = this.validate();
    if (check === true) {

      if (this.isValid()) {
        var where = {};
        where[this.primaryKey] = this.attrs[this.primaryKey];

        this.model._storageEngine.query().update().where(where).set(this.attrs).limit(1).call(function (err) {
          callback(err);
        });
      } else {
        this.model._storageEngine.query().insert().set(this.attrs).call(function (err, data) {
          if (data.affectedRows > 0) {
            this[this.primaryKey](data.insertId);
          }

          callback(err, data.insertId || null);
        }.bind(this));
      }

    } else {
      //console.dir("Save failed by validation: " + check);
      callback(check);
    }
  };

  Model.prototype.isValid = function () {
    var id = this[this.primaryKey]();

    if (!id) return false;

    if (parseInt(id) === id) {
      return true;
    }

    if ((new RegExp(/^[0-9a-f]{24}$/)).test(id)) {
      return true;
    }
    return false;
  };

  Model.prototype.delete = function (/* callback */) {
    var callback = (arguments.length > 0) ? arguments[arguments.length - 1] : function () {
    };

    if (this.isValid()) {
      var where = {};
      where[this.primaryKey] = this.attrs[this.primaryKey];

      this.model._storageEngine.query().delete(where).limit(1).call(function (err) {
        callback(err);
      });
    }
  };

  return Model;
};
