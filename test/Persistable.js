var Persistable = require('../lib/Persistable').Persistable,
    vows = require('vows'),
    assert = require('assert'),
    sys = require('sys');

vows.describe('Persistable').addBatch({
    'A Persistable': {
        topic: new Persistable(),

        'must not be null': function(per) {
            assert.strictEqual(typeof(per), 'object');
        },

        'must be an instance of Persistable': function(per) {
            assert.ok(per instanceof Persistable);
        },

        'must define the following interface methods': {
            'getCollectionName': function(per) {
                assert.strictEqual(typeof(per.getCollectionName), 'function');
                assert.throws(function(){per.getCollectionName()});
            },

            'toObject': function(per) {
                assert.strictEqual(typeof(per.toObject), 'function');
                assert.throws(function(){per.toObject()});
            },

            'initFromObject': function(per) {
                assert.strictEqual(typeof(per.initFromObject), 'function');
                assert.throws(function(){per.initFromObject()});
            }
        }
    }
}).export(module);
