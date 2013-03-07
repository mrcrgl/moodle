/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 02.03.13
 * Time: 14:32
 *
 */

var DefaultStorage = require('./default'),
    QueryBuilder    = require('../../db-querybuilder');

var Storage = function(Model) {
    this._connect = function() {};
    this._table = null;
    this._model = Model;
};

Storage.prototype = new DefaultStorage();

Storage.prototype.connect = function(connect) {
    this._connect = connect;

    return this;
};

Storage.prototype.table = function(table) {
    if (arguments.length <= 0) return this.table || null;

    this._table = table;

    return this;
};

Storage.prototype.query = function() {
    var query = new QueryBuilder('mysql');

    var storage = this;

    return query.from(this._table)
        .handler(function(query, callback) {
        storage.execute(query, callback);
    });
};

Storage.prototype.execute = function(query, callback) {
    this._connect().query(query, callback);
};

module.exports = Storage;