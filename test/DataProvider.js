var DataProvider = require('../lib/DataProvider').DataProvider,
    Persistable = require('../lib/Persistable').Persistable,
    vows = require('vows'),
    assert = require('assert'),
    sys = require('sys');

var mongoConfig = {
    driver: 'mongodb',
    host: 'localhost',
    dbname: 'test'
};

//Implement a Persistable subclass
var TestModel = function(raw) {
    raw = raw || {};
    Persistable.call(this);
    this.raw = raw;
};
sys.inherits(TestModel, Persistable);
TestModel.prototype.getCollectionName = function() { return 'test' };
TestModel.prototype.toObject = function() { return this.raw };

vows.describe('DataProvider').addBatch({
    'DataProvider': {
        'should have an initCfg method': function() {
            assert.equal(typeof(DataProvider.initCfg), 'function');
        },

        'getInstance should err on bad name': function() {
            assert.throws(function() {
                DataProvider.initCfg({}); //ensure blank config
                DataProvider.getInstance('fake');
            });
        },

        'getInstance should return default conn if none specified': function() {
            DataProvider.initCfg({default:{host:'localhost',dbname:'test'}});
            var dp = DataProvider.getInstance();
            assert.ok(dp instanceof DataProvider);
        },

        'getInstance should return named connection when specified': function() {
            DataProvider.initCfg({testname:{host:'localhost',dbname:'test'}});
            var dp = DataProvider.getInstance('testname');
            assert.ok(dp instanceof DataProvider);
        },

        'getInstance should only create one of each connection name': function() {
            DataProvider.initCfg({'default':{host:'localhost',dbname:'test'}});
            var dp1 = DataProvider.getInstance();
            var dp2 = DataProvider.getInstance();
            assert.strictEqual(dp1, dp2);
        }
    },

    'A DataProvider instance': {
        topic: new DataProvider(mongoConfig),

        'should not be null': function(dp) {
            assert.strictEqual(typeof(dp), 'object');
        },  

        'must be an instance of DataProvider': function(dp) {
            assert.ok(dp instanceof DataProvider);
        },

        'should save': {
            topic: function(dp) {
                var model = new TestModel({id:1,foo:'bar'});
                dp.save(model, this.callback);
            },

            'test': function(err, model) {
                assert.ok(!err);
            }
        },

        'should save using doOnCollection': {
            topic: function(dp) {
                var model = new TestModel({id:1,foo:'bar'});
                dp.doOnCollection('test', 'insert', [{id:2,foo:'bar2'}], this.callback);
            },

            'test': function(err, docs) {
                assert.ok(!err);
            }
        }
    }
}).export(module);
