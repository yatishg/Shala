// TODO: Connection pooling.

// Library inclusions. 
var mongodb = require('mongodb');
var promise = require('bluebird');
var MongoClient = promise.promisifyAll(mongodb).MongoClient;

// Class inclusions.
var mongoConfig = require('./../configs/Config').mongoConfig;

// Private variables.
var using = promise.using;
var dbConnection = null;

var mongoDB = {
    /* HELPER METHODS START */
    // Resolves with connection.
	connect: function() {
		return new promise(function(resolve) {
			if(dbConnection) {
				resolve(dbConnection);
			}
			else {
				MongoClient.connectAsync(mongoConfig.projectUrl)
					.then(function(db) {
						dbConnection = db;
						resolve(dbConnection);
					}, function(err) {
						throw err;
					}).
					catch(function(err) {
						throw err;
					});
			}
		});
	},
    /* HELPER METHODS END */

    /* GET METHODS START */
    // Returns specified or less number of documents.
	findNDocuments: function(findData, collectionName, pageSize) {
		return using(this.connect(),
					function(db) {
						var collection = db.collection(collectionName);
						return collection.findAsync(findData, {
                            'limit': pageSize
                        })
                        .then(function(data){
                            return data.toArrayAsync();
                        });
					} 
			);
	},

    // Returns documents.
	findDocuments: function(findData, collectionName) {
		return using(this.connect(),
					function(db) {
						var collection = db.collection(collectionName);
						return collection.findAsync(findData)
								.then(function(data) {
									return data.toArrayAsync();
								});
					} 
			);
	},

    // Returns documents afetr sorting.
	findAndSortDocuments: function(findData, orderData, collectionName) {
		return this.connect()
					.then(function(db) {
						var collection = db.collection(collectionName);
						return collection.findAsync(findData);
					})
					.then(function(data) {
						return data.sort(orderData).toArrayAsync();
					})
	},

    // Returns first matching document.
	findOneDocument: function(findData, collectionName) {
		return using(this.connect(),
					function(db) {
						var collection = db.collection(collectionName);
						return collection.findOneAsync(findData);
					} 
			);
	},
    /* GET METHODS END */

    /* PUT METHODS START */
    // Inserts documents.
	insertDocuments: function(collectionName, docsArr) {
		return using(this.connect(),
					function(db) {
						var collection = db.collection(collectionName);
						return collection.insertManyAsync(docsArr);
					} 
			);
	},

    // Updates documents.
	updateDocuments:function(criteria, updateDoc, collectionName) {
		delete updateDoc._id;
		return using(this.connect(),
			function(db) {
				var collection = db.collection(collectionName);
				return collection.updateAsync(criteria, updateDoc);
			}
		);
	},
    /* PUT METHODS END */

    /* DELETE METHODS START */
    // Deletes given document.
	deleteDocument: function(collectionName, doc) {
		return using(this.connect(),
					function(db) {
						var collection = db.collection(collectionName);
						return collection.deleteOneAsync(doc);
					} 
			);
	},

    // Deletes all documents in a collection.
	removeAllDocuments: function(collectionName) {
		return using(this.connect(),
					function(db) {
						var collection = db.collection(collectionName);
						return collection.removeAsync();
					} 
			);
	},

    // Deletes collection.
	deleteCollection: function(collectionName) {
		return this.connect()
					.then(function(db) {
						var collection = db.collection(collectionName);
						return collection.dropAsync();
					})
	},
    /* DELETE METHODS END */

    /* COUNT METHODS START */
    // Returns documents count in a collection.
	allDocumentCount: function(collectionName) {
		return this.connect()
					.then(function(db) {
						var collection = db.collection(collectionName);
						return collection.countAsync();
					});
	},

    // Returns count of matching documents.
	getDocumentCountByQuery:function(collectionName, query) {
		return this.connect()
				.then(function(db) {
					var collection = db.collection(collectionName);
					return collection.findAsync(query)
				})
				.then(function(data) {
					return data.countAsync();
				});
	}
    /* COUNT METHODS END */
};

module.exports = mongoDB;