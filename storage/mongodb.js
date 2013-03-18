/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 11.03.13
 * Time: 09:03
 *
 */


var DefaultStorage = require('./default'),
    QueryBuilder    = require('../../node-querybuilder');

var Storage = function(Model) {
    this._connect = function() {};
    this._model = Model;
};

Storage.prototype = new DefaultStorage();

Storage.prototype.connect = function(connect) {
    this._connect = connect;

    return this;
};

Storage.prototype.query = function() {
    var query = new QueryBuilder('mongodb');

    var storage = this;

    return query
        .handler(function(query, callback) {
            storage.execute(query, callback);
        });
};

Storage.prototype.execute = function(query, callback) {

    console.dir(query);

    var cursor = null,
        multiple = (query.limit > 1) ? true : false,
        sent = false;



    if (query.type == 'select') {
        //if (multiple) {
            cursor = this._connect().find(query.where);
        //} else {
        //    cursor = this._connect().findOne(query.where, callback);
        //    sent = true;
        //}
    } else if (query.type == 'update') {
        cursor = this._connect().update(query.where, query.set, { safe: true }, function(err) {
            if (err) console.error(err);
            callback(err);
        });
        sent = true;
    } else if (query.type == 'delete') {
        cursor = this._connect().remove(query.where, callback);
        sent = true;
    } else if (query.type == 'insert') {
        cursor = this._connect().insert(query.set, { safe: true }, callback);
        sent = true;
    }

    if (null === cursor) {
        throw "Invalid query type: " + query.type;
    }

    if (!sent) {
        if (query.type == 'select') {
            if (query.limit) {
                cursor = cursor.limit(query.limit);
            }
            if (query.skip) {
                cursor = cursor.skip(query.skip);
            }
            if (query.sort) {
                cursor = cursor.sort(query.sort);
            }
        }

        cursor.toArray(callback);
    }

};

module.exports = Storage;
