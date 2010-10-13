#node-nosql-thin

This library helps you use MongoDB. Eventually it may support other document-oriented (NoSQL) databases.

#Design goals

In many cases, especially with document oriented databases, an ORM is no longer needed. The documents
are easy to work with and map naturally to objects. In some cases, the user many not even want to
map the documents to anything, but would prefer to work with the documents directly. Based on that
theory, here are the design goals.

 - Allow users to pass in raw documents and provide a means for them to get raw documents in response.
 - In the case that a user does want to use a model, provide a simple means of integrating their model
   with this library (e.g. so they can call model.save() or get a list of models in response to a query).
 - Don't couple this code with the user's model code. Let the user make their models however they want.
 - Simplify simple operations such as saving or finding so they can be done with a single call.
 - Provide a means to configure connections in one place.
 - Provide simple connection pooling.

#Status

This is a very new project. I've only used it so far for save and find methods (it doesn't currently
support any other methods). Not all of the design goals are achieved yet. In particular, the following
is lacking:

 - Allow users to pass in raw documents and provide a means for them to get raw documents in response.
 - In the case that a user does want to use a model, provide a simple means of integrating their model
   with this library (e.g. so they can call model.save() or get a list of models in response to a query).
