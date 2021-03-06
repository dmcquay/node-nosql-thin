#node-nosql-thin

This library helps you use MongoDB without forcing you to use an ORM. Eventually it may support other
document-oriented (NoSQL) databases.

In many cases, especially with document oriented databases, an ORM is no longer needed. The documents
are easy to work with and map naturally to objects. In some cases, the user many not even want to
map the documents to anything, but would prefer to work with the documents directly. Based on that
theory, here are the design goals.

#Installation

npm install nosql-thin@latest

#Design goals

 - Allow users to pass in raw documents and provide a means for them to get raw documents in response.
 - In the case that a user does want to use a model, provide a simple means of integrating their model
   with this library (e.g. so they can call model.save() or get a list of models in response to a query).
 - Don't couple this code with the user's model code. Let the user make their models however they want.
 - Simplify simple operations such as saving or finding so they can be done with a single call.
 - Provide a means to configure connections in one place.
 - Provide simple connection pooling.

#Example

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

#Status

This is a very new project. I've only used it so far for save and find methods (it doesn't currently
support any other methods). Not all of the design goals are achieved yet. In particular, the following
is lacking:

 - Allow users to pass in raw documents and provide a means for them to get raw documents in response.
 - In the case that a user does want to use a model, provide a simple means of integrating their model
   with this library (e.g. so they can call model.save() or get a list of models in response to a query).
