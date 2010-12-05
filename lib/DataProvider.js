var mongodb = require('mongodb'),
    sys = require('sys');

var DataProvider = function(cfg) {
    cfg = cfg || {};

    if (!cfg.host) {
        sys.log('No host config. Defaulting to \'localhost\'.');
        cfg.host = 'localhost';
    }
    cfg.port = cfg.port || 27017;
    if (!cfg.dbname) {
        sys.log('No dbname config. Defaulting to \'test\'.');
        cfg.dbname = 'test';
    }

    this.cfg = cfg;
};

DataProvider.initCfg = function(cfg) {
    DataProvider._cfg = cfg;
};

DataProvider.getInstance = function(connName) {
    connName = connName || 'default';
    DataProvider._instances = DataProvider._instances || {};
    if (!DataProvider._instances[connName]) {
        if (!DataProvider._cfg[connName]) {
            throw new Error('Unknown connection: ' + connName);
        }
        DataProvider._instances[connName] = new DataProvider(DataProvider._cfg[connName]);
    }
    return DataProvider._instances[connName];
};

DataProvider.prototype.doOnCollection = function(collectionName, funcName, args, callback) {
    var db = new mongodb.Db(
        this.cfg.dbname,
        new mongodb.Server(this.cfg.host, this.cfg.port, {auto_reconnect:true}),
        {strict:false}
    );
    db.addListener('error', callback);
    db.open(function(err, db) {
        if (err) { return callback(err) }
        db.createCollection(collectionName, function(err, collection) {
            if (err) { return callback(err) }
            var internalCallback = function() {
                db.close();
                callback.apply(this, arguments);
            };
            args.push(internalCallback);
            collection[funcName].apply(collection, args);
        });
    });
};

DataProvider.prototype.save = function(persistable, callback) {
    var db = new mongodb.Db(
        this.cfg.dbname,
        new mongodb.Server(this.cfg.host, this.cfg.port, {auto_reconnect:true}),
        {strict:false}
    );
    db.addListener('error', callback);
    db.open(function(err, db) {
        if (err) { return callback(err) }
        db.createCollection(persistable.getCollectionName(), function(err, collection) {
            if (err) { return callback(err) }
            collection.save(persistable.toObject(), function(err, docs) {
                db.close();
                callback(null, persistable);
            });
        });
    });
};

DataProvider.prototype.find = function(klass, queryObj, callback) {
    var self = this;
    var db = new mongodb.Db(
        this.cfg.dbname,
        new mongodb.Server(this.cfg.host, this.cfg.port, {auto_reconnect:true}),
        {strict:false}
    );
    db.addListener('error', callback);
    db.open(function(err, db) {
        if (err) return callback(err);
        db.createCollection(klass.prototype.getCollectionName(), function(err, collection) {
            if (err) return callback(err);
			collection.find(queryObj, function(err, cursor) {
				if (err) return callback(err);
				cursor.toArray(function(err, docs) {
					if (err) return callback(err);
					var objs = [];
					for (var i = 0; i < docs.length; i++) {
						objs.push(new klass(docs[i]));
					}
					db.close();
					callback(null, objs);
				});
			});
        });
    });
};

exports.DataProvider = DataProvider;
