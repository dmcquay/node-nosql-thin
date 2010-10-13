var Persistable = function(){};

Persistable.prototype.getCollectionName = function() { throw new Error('not implemented') };

Persistable.prototype.toObject = function() { throw new Error('not implemented') };

Persistable.prototype.initFromObject = function() { throw new Error('not implemented') };

exports.Persistable = Persistable;
