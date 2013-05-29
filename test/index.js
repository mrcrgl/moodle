/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 13.05.13
 * Time: 15:00
 *
 */

var vows = require('vows'),
  assert = require('assert'),
  Model = require('../index');

var createTestModel = function() {
  var TestModel = new Model('TestModel');

  TestModel.storage('mysql').connect(
    function() {
      // Return your mongo instance with selected collection
      return ;
    }
  ).table('test_table');

  TestModel.attr('id', 'Id');

  TestModel.attr('string', 'String');

  TestModel.attr('date', 'Date');

  TestModel.attr('bool', 'Bool');

  TestModel.attr('object', 'Object');

  TestModel.attr('integer', 'Integer');

  TestModel.attr('created', 'Date');

  TestModel.attr('array', 'Array');

  TestModel.attr('enum', 'Enum')
    .option('1')
    .option('0')
    .default('1');

  return TestModel;
};

var MyTestModel = createTestModel();

vows.describe('Check Model API (MySQL)').addBatch({
  'Basics': {
    topic: function () {
      return createTestModel();
    },
    'create instance': {
      'without attributes': function(Object) {
        assert.doesNotThrow(function() { new(Object) }, "Instance failed");
      }
    },
    'check exist of management method': {
      'find': function(Object) {
        assert.isTrue(Object.hasOwnProperty('find'), "Method `find` not defined");
      },
      'findOne': function(Object) {
        assert.isTrue(Object.hasOwnProperty('findOne'), "Method `findOne` not defined");
      },
      'attr': function(Object) {
        assert.isTrue(Object.hasOwnProperty('attr'), "Method `attr` not defined");
      },
      'storage': function(Object) {
        assert.isTrue(Object.hasOwnProperty('storage'), "Method `storage` not defined");
      }
    },
    'create instance': {
      'without attributes': function(Object) {
        assert.doesNotThrow(function() { new(Object) }, "Instance failed");
      }
    }
  },

  'Attributes': {
    topic: function() {
      var m = createTestModel();
      return new MyTestModel();
    },

    'test attribute string': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.string()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.string('dgsdhsdh');}, Error);
      }
    },
    'test attribute array': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.array()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.array(['foo', 'bar']);}, Error);
      }
    },
    'test attribute date': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.date()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.date(new Date());}, Error);
      }
    },
    'test attribute enum': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.enum()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.enum('1');}, Error);
      }
    },
    'test attribute object': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.object()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.object({foo: 'bar'});}, Error);
      }
    },
    'test attribute bool': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.bool()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.bool(1);}, Error);
        assert.doesNotThrow(function() {model.bool(true);}, Error);
        assert.doesNotThrow(function() {model.bool(false);}, Error);
      }
    },
    'test attribute integer': {
      'api': function (model) {
        assert.doesNotThrow(function() {model.integer()}, "Getter / Setter is not builtin");
      },
      'functionality': function (model) {
        assert.doesNotThrow(function() {model.integer(4356345);}, Error);
      }
    }
  }
}).export(module);