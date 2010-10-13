var Persistable = require('nosql-thin').Persistable,
    DataProvider = require('nosql-thin').DataProvider,
    sys = require('sys');

//you'd likely store this in an external config or at least a separate module
var dataCfg = {
    default: {
        'host': 'localhost',
        'dbname': 'test'
    }
};

//you must do this once somewhere in your code before you use DataProvider
DataProvider.initCfg(dataCfg);

var User = function(raw) {
    raw = raw || {};
    Persistable.call(this);
    this.raw = raw;
};
sys.inherits(User, Persistable);

//Implement Persistable interface
User.prototype.getCollectionName = function() { return 'users' };
User.prototype.toObject = function() { return this.raw };

//Crate a new User
var user = new User({name: 'Madonna'});

//Save the user
DataProvider.getInstance().save(user, function(err, user) {
    if (err) throw new Error(err);
    sys.puts('user saved!');

    //Find the user
    DataProvider.getInstance().find(User, {name: 'Madonna'}, function(err, users) {
        if (err) throw new Error(err);
        sys.puts('found ' + users.length + ' users');
        sys.puts('first user\'s name is ' + users[0].raw.name);
    });
});

